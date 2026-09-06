import { computeSectionMastery, computeAnonSectionStatus } from '../logic/section-progress';

describe('computeSectionMastery', () => {
  it('returns in_progress when no cards have been reviewed', () => {
    const result = computeSectionMastery([], 10);
    expect(result).toEqual({ reviewedCards: 0, masteredCards: 0, status: 'in_progress' });
  });

  it('returns in_progress when some but not all cards are reviewed', () => {
    const result = computeSectionMastery(
      [
        { reviewed: true, mastered: false },
        { reviewed: true, mastered: false },
      ],
      5,
    );
    expect(result).toEqual({ reviewedCards: 2, masteredCards: 0, status: 'in_progress' });
  });

  it('returns completed once every card has been reviewed but not all mastered', () => {
    const result = computeSectionMastery(
      [
        { reviewed: true, mastered: true },
        { reviewed: true, mastered: false },
      ],
      2,
    );
    expect(result).toEqual({ reviewedCards: 2, masteredCards: 1, status: 'completed' });
  });

  it('returns mastered once every card is mastered', () => {
    const result = computeSectionMastery(
      [
        { reviewed: true, mastered: true },
        { reviewed: true, mastered: true },
      ],
      2,
    );
    expect(result).toEqual({ reviewedCards: 2, masteredCards: 2, status: 'mastered' });
  });

  it('handles a card regressing out of mastery after a failed review', () => {
    // e.g. a card was mastered, then reviewed again with a failing quality —
    // repetitions reset, so it should drop out of masteredCards.
    const result = computeSectionMastery(
      [
        { reviewed: true, mastered: false }, // regressed
        { reviewed: true, mastered: true },
      ],
      2,
    );
    expect(result.masteredCards).toBe(1);
    expect(result.status).toBe('completed');
  });

  it('treats an empty section (0 cards) as in_progress, never completed', () => {
    const result = computeSectionMastery([], 0);
    expect(result.status).toBe('in_progress');
  });
});

describe('computeAnonSectionStatus', () => {
  it('stays in_progress until every card in the section has been reviewed', () => {
    // Regression: a 50-card section studied in a 10-card session must not
    // flip to "completed" after only the session's last card.
    expect(computeAnonSectionStatus(10, 50)).toBe('in_progress');
  });

  it('flips to completed once the reviewed count reaches the section total', () => {
    expect(computeAnonSectionStatus(50, 50)).toBe('completed');
  });

  it('flips to completed for a small section fully covered by one session', () => {
    expect(computeAnonSectionStatus(8, 8)).toBe('completed');
  });

  it('treats a 0-card section as in_progress, never completed', () => {
    expect(computeAnonSectionStatus(0, 0)).toBe('in_progress');
  });
});
