'use client';

import dynamic from 'next/dynamic';
import type { StudyCard } from './FlashcardDeck';

const FlashcardDeck = dynamic(
  () => import('./FlashcardDeck').then(m => ({ default: m.FlashcardDeck })),
  { ssr: false },
);

type Props = {
  cards: StudyCard[];
  sectionTitle: string;
  language: string;
  backHref: string;
  sectionPayloadId: string;
};

export function FlashcardDeckClient(props: Props) {
  return <FlashcardDeck {...props} />;
}
