export type CheatSheetEntry = {
  id: string;
  payloadId: string;
  languageSlug: string;
  category: string;
  title: string;
  syntax: string;
  description: string;
  example?: string;
  order: number;
};
