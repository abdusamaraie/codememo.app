/** Quality rating mapped from confidence buttons: Forgot=1, Hard=3, Good=4, Nailed=5 */
export type QualityRating = 1 | 3 | 4 | 5;

export type SM2Params = {
  interval: number;       // days until next review
  repetitions: number;    // number of successful reviews in a row
  easeFactor: number;     // difficulty multiplier (min 1.3)
  nextReviewAt: number;   // unix timestamp (ms)
};

export type CardProgress = {
  id: string;
  userId: string;
  flashcardId: string;
  sm2: SM2Params;
  lastReviewedAt: number;
  totalReviews: number;
  successfulReviews: number;
};

export type SectionProgress = {
  id: string;
  userId: string;
  sectionId: string;
  status: import('./section').SectionStatus;
  cardsDue: number;
  cardsNew: number;
  cardsMastered: number;
  lastStudiedAt?: number;
};
