/**
 * Client-Side Resilient JSON Parsing & Repair Utility
 * 
 * LLM responses often suffer from minor syntax issues:
 * 1. Markdown codeblock backticks (```json ... ```)
 * 2. Preambles ("Here is your itinerary: { ... }")
 * 3. Trailing commas before closing brackets ({ "a": 1, })
 * 4. Truncated closing brackets if token limits hit
 * 5. Single quotes instead of double quotes
 */

export class JSONParseError extends Error {
  constructor(message, rawText, repairAttempted = false) {
    super(message);
    this.name = 'JSONParseError';
    this.rawText = rawText;
    this.repairAttempted = repairAttempted;
  }
}

export function resilientJSONParse(text) {
  if (!text || typeof text !== 'string') {
    throw new JSONParseError('Empty or invalid response from AI model', String(text));
  }

  let cleaned = text.trim();

  // Strip markdown code fences
  if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/```(?:json)?\n?/gi, '').replace(/```\s*$/gi, '').trim();
  }

  // Attempt standard JSON.parse first
  try {
    return JSON.parse(cleaned);
  } catch (initialError) {
    console.warn('[JSON Repair] Standard parse failed, attempting heuristics...', initialError.message);
  }

  // Heuristic 1: Extract text between the first '{' and the last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Heuristic 2: Remove trailing commas before } or ]
  let repaired = cleaned.replace(/,\s*([}\]])/g, '$1');

  // Heuristic 3: Replace unescaped control characters (newlines within strings)
  repaired = repaired.replace(/\r?\n/g, ' ');

  try {
    const result = JSON.parse(repaired);
    console.info('[JSON Repair] Successfully repaired and parsed LLM JSON output!');
    return result;
  } catch (secondError) {
    // Heuristic 4: Check if unclosed brackets occurred due to truncation
    let bracketStack = [];
    for (let char of repaired) {
      if (char === '{' || char === '[') bracketStack.push(char);
      if (char === '}' && bracketStack[bracketStack.length - 1] === '{') bracketStack.pop();
      if (char === ']' && bracketStack[bracketStack.length - 1] === '[') bracketStack.pop();
    }

    if (bracketStack.length > 0) {
      let closedStr = repaired;
      while (bracketStack.length > 0) {
        const unclosed = bracketStack.pop();
        closedStr += unclosed === '{' ? '}' : ']';
      }
      try {
        const result = JSON.parse(closedStr);
        console.info('[JSON Repair] Fixed truncated JSON by balancing unclosed brackets!');
        return result;
      } catch (thirdError) {
        // Fall through to error
      }
    }

    throw new JSONParseError(
      `Failed to parse AI output: ${secondError.message}`,
      text,
      true
    );
  }
}
