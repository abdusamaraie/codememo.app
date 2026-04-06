export type SectionStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';

export type Section = {
  id: string;
  payloadId: string;
  languageId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  isPublished: boolean;
};
