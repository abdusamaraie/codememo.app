export type SectionMasteryStatus = 'in_progress' | 'completed' | 'mastered';

/**
 * Recomputes a section's reviewed/mastered card counts from the per-card
 * progress state. Fully recomputing (rather than accumulating a delta) keeps
 * the counters self-healing — they can't drift from double-fired events, and
 * they correctly handle a card regressing out of "mastered" after a failed
 * review.
 */
export function computeSectionMastery(
  cardStates: Array<{ reviewed: boolean; mastered: boolean }>,
  totalCards: number,
): { reviewedCards: number; masteredCards: number; status: SectionMasteryStatus } {
  let reviewedCards = 0;
  let masteredCards = 0;

  for (const card of cardStates) {
    if (card.reviewed) reviewedCards += 1;
    if (card.mastered) masteredCards += 1;
  }

  const status: SectionMasteryStatus =
    totalCards > 0 && masteredCards >= totalCards
      ? 'mastered'
      : totalCards > 0 && reviewedCards >= totalCards
        ? 'completed'
        : 'in_progress';

  return { reviewedCards, masteredCards, status };
}

/**
 * Anonymous (local-only) section status: a section is 'completed' only once
 * every card in it has been reviewed at least once — not merely the last
 * card of whatever random study-session sample the user happened to draw.
 */
export function computeAnonSectionStatus(
  reviewedCardCount: number,
  totalCardsInSection: number,
): 'in_progress' | 'completed' {
  return totalCardsInSection > 0 && reviewedCardCount >= totalCardsInSection
    ? 'completed'
    : 'in_progress';
}
