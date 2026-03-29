export type QuestionType = 'free_recall' | 'code_completion' | 'explain_output' | 'spot_error' | 'fill_blank';

export type FlashcardFace = {
  type: 'front' | 'back';
  content: string;
  codeSnippet?: string;
  language?: string;
};

export type Flashcard = {
  id: string;
  payloadId: string;
  sectionId: string;
  question: string;
  questionType: QuestionType;
  answer: string;
  answerCode?: string;
  explanation?: string;
  hint?: string;
  commonMistakes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  order: number;
};
