export type LanguageSlug = 'python' | 'javascript' | 'typescript' | 'rust' | 'go' | 'java' | 'cpp' | 'csharp' | 'swift' | 'kotlin' | 'jcr-sql2';

export type Language = {
  id: string;
  payloadId: string;
  slug: LanguageSlug;
  name: string;
  description: string;
  color: string;
  order: number;
  isPublished: boolean;
};
