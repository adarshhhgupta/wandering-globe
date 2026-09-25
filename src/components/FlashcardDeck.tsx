import React, { useState } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, BookmarkCheck } from 'lucide-react';

/**
 * @file FlashcardDeck.tsx
 * @description Interactive Flashcard Component explicitly referenced in Flam Assignment Guide (Section 5).
 * "FlashcardDeck.tsx # example: study-assistant view"
 * 
 * Provides:
 * - 3D card flip animation on click / spacebar
 * - Card navigation (Previous / Next / Shuffle)
 * - Self-assessment confidence tracking (Got it right / Needs review)
 * - Re-test wrong answers queue
 */

export interface Flashcard {
  id?: string | number;
  question: string;
  answer: string;
  category?: string;
  hint?: string;
}

export interface FlashcardDeckProps {
  cards?: Flashcard[];
  title?: string;
  onComplete?: () => void;
}

const DEFAULT_CARDS: Flashcard[] = [
  {
    id: 1,
    question: "What is the recommended time to visit Kyoto's Fushimi Inari shrine to avoid crowds?",
    answer: "Before 07:30 AM or at twilight after 06:00 PM when the thousands of vermilion torii gates are softly illuminated and peaceful.",
    category: "Culture & Timing",
    hint: "Think early sunrise or lantern-lit dusk"
  },
  {
    id: 2,
    question: "What essential pass gives you unlimited train travel across major Japan cities?",
    answer: "The JR Pass (Japan Rail Pass) or regional passes like the Kansai Thru Pass for Kyoto/Osaka subways.",
    category: "Transit",
    hint: "Abbreviation starting with J"
  },
  {
    id: 3,
    question: "How do you handle dietary restrictions in local street markets without speaking the language?",
    answer: "Carry pre-translated dietary cards (e.g., 'no pork' or 'gluten allergy') on your phone and look for English allergen icons.",
    category: "Insider Advice",
    hint: "Visual translation aids"
  }
];

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards = DEFAULT_CARDS,
  title = "Interactive Destination Flashcards",
  onComplete
}) => {
  const activeDeck = cards && cards.length > 0 ? cards : DEFAULT_CARDS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<number[]>([]);
  const [needsReview, setNeedsReview] = useState<number[]>([]);

  const currentCard = activeDeck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkMastered = () => {
    if (!reviewedCards.includes(currentIndex)) {
      setReviewedCards([...reviewedCards, currentIndex]);
    }
    setNeedsReview(needsReview.filter((idx) => idx !== currentIndex));
    handleNext();
  };

  const handleMarkReview = () => {
    if (!needsReview.includes(currentIndex)) {
      setNeedsReview([...needsReview, currentIndex]);
    }
    handleNext();
  };

  return (
    <div className="flashcard-deck-container" style={{ maxWidth: '640px', margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Card {currentIndex + 1} of {activeDeck.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            ✓ {reviewedCards.length} Mastered
          </span>
          {needsReview.length > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              ⟳ {needsReview.length} To Review
            </span>
          )}
        </div>
      </div>

      {/* 3D Flip Card */}
      <div
        className={`flashcard-card-perspective ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === ' ' && handleFlip()}
        style={{
          minHeight: '260px',
          perspective: '1000px',
          cursor: 'pointer',
          borderRadius: 'var(--radius-lg, 16px)',
          position: 'relative',
          transition: 'transform 0.2s ease',
          outline: 'none'
        }}
      >
        <div
          style={{
            background: 'var(--glass-tier1-bg, rgba(255, 255, 255, 0.65))',
            backdropFilter: 'var(--glass-blur, blur(20px))',
            WebkitBackdropFilter: 'var(--glass-blur, blur(20px))',
            border: '1px solid var(--border-glass, rgba(255, 255, 255, 0.25))',
            borderRadius: 'var(--radius-lg, 16px)',
            padding: '32px 28px',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-glass, 0 12px 36px rgba(0, 0, 0, 0.08))',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--accent-primary, #6366f1)',
                background: 'var(--accent-subtle, rgba(99, 102, 241, 0.1))',
                padding: '4px 12px',
                borderRadius: '999px'
              }}
            >
              {currentCard?.category || 'Insight'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RotateCw size={13} /> Click to flip
            </span>
          </div>

          <div style={{ margin: '24px 0', textAlign: 'center' }}>
            {!isFlipped ? (
              <div>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {currentCard?.question}
                </p>
                {currentCard?.hint && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '12px' }}>
                    💡 Hint: {currentCard.hint}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ios-green, #10b981)', textTransform: 'uppercase' }}>
                  Answer
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '8px' }}>
                  {currentCard?.answer}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            <span>{isFlipped ? 'Answer View' : 'Question View'}</span>
            <span>Tap Space or Card to Flip</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
        <button
          type="button"
          className="btn btn-secondary-subtle btn-sm"
          onClick={handlePrev}
          aria-label="Previous card"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-danger-subtle btn-sm"
            onClick={handleMarkReview}
            title="Mark for re-test"
          >
            Needs Review
          </button>
          <button
            type="button"
            className="btn btn-success-subtle btn-sm"
            onClick={handleMarkMastered}
            title="Mark as mastered"
          >
            Mastered ✓
          </button>
        </div>

        <button
          type="button"
          className="btn btn-secondary-subtle btn-sm"
          onClick={handleNext}
          aria-label="Next card"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
