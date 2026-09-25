/**
 * Presets, category metadata, and client-side fallback data
 */

export const SAMPLE_PROMPTS = [
  {
    id: 'tokyo-kyoto',
    emoji: '🌸',
    title: 'Tokyo & Kyoto Zen & Neon',
    country: 'Japan',
    duration: '4 Days',
    vibe: 'Culture & Food',
    tagline: 'Ancient moss shrines, Tsukiji street food & neon nightlife',
    label: '🌸 Tokyo & Kyoto Culture',
    text: '4 days in Kyoto and Tokyo. We love tranquil temples, ancient food markets, matcha ceremonies, and neon night photography on a moderate budget.',
    badgeColor: '#ec4899',
    badgeBg: '#fdf2f8'
  },
  {
    id: 'paris-art',
    emoji: '🥐',
    title: 'Parisian Romance & Art',
    country: 'France',
    duration: '3 Days',
    vibe: 'Romantic & Culinary',
    tagline: 'Montmartre bakeries, impressionist art & sunset Seine cruise',
    label: '🥐 Romantic Weekend in Paris',
    text: '3-day romantic trip to Paris for two. Focus on cozy bakery breakfasts in Montmartre, impressionist art, and a sunset Seine river cruise on a medium budget.',
    badgeColor: '#e11d48',
    badgeBg: '#fff1f2'
  },
  {
    id: 'iceland-expedition',
    emoji: '🌋',
    title: 'Iceland Ring Road Expedition',
    country: 'Iceland',
    duration: '5 Days',
    vibe: 'Adventure & Nature',
    tagline: 'Glacial lagoons, black sand beaches & geothermal springs',
    label: '🌋 Iceland South Coast Roadtrip',
    text: '5-day adventure road trip along Iceland\'s Golden Circle and South Coast. Looking for waterfalls, black sand beaches, geothermal hot springs, and glacier hiking.',
    badgeColor: '#0284c7',
    badgeBg: '#f0f9ff'
  },
  {
    id: 'bali-retreat',
    emoji: '🏝️',
    title: 'Bali Sanctuary & Coast',
    country: 'Indonesia',
    duration: '4 Days',
    vibe: 'Relaxed & Scenic',
    tagline: 'Ubud jungle terraces, wellness yoga & Uluwatu clifftop sunsets',
    label: '🏖️ Bali Beach & Wellness Retreat',
    text: '4 days in Ubud and Canggu, Bali. Relaxed pace with yoga sessions, organic smoothie bowls, rice terrace walks, and sunset beach clubs.',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5'
  }
];

export const CATEGORY_COLORS = {
  Sightseeing: { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.25)' },
  Food: { bg: 'rgba(249, 115, 22, 0.12)', text: '#f97316', border: 'rgba(249, 115, 22, 0.25)' },
  Adventure: { bg: 'rgba(234, 88, 12, 0.12)', text: '#ea580c', border: 'rgba(234, 88, 12, 0.25)' },
  Culture: { bg: 'rgba(168, 85, 247, 0.12)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.25)' },
  Relaxation: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981', border: 'rgba(16, 185, 129, 0.25)' },
  Nightlife: { bg: 'rgba(236, 72, 153, 0.12)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.25)' },
  Shopping: { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' },
  Transit: { bg: 'rgba(100, 116, 139, 0.12)', text: '#64748b', border: 'rgba(100, 116, 139, 0.25)' }
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥'
};

export const CURRENCY_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 86.5,
  JPY: 154.0
};

export function convertCurrency(baseAmountUsd, targetCurrency = 'USD') {
  const rate = CURRENCY_RATES[targetCurrency] || 1.0;
  return Math.round(Number(baseAmountUsd || 0) * rate);
}

export const REFINEMENT_PRESETS = [
  "💰 Make it more budget-friendly",
  "🍜 Swap dinners for authentic street food",
  "⚡ Slow down the pace, fewer stops",
  "🏛️ Add a world-class art museum",
  "👶 Make activities family-friendly",
  "🌅 Add a breathtaking sunrise viewpoint"
];
