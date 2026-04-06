'use client';

import { CodeDiff } from './CodeDiff';

type Props = {
  answer: string;
  answerCode?: string;
  language?: string;
  explanation?: string;
  userAttempt: string;
};

export function FlashcardBack({ answer, answerCode, language, explanation, userAttempt }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Diff section — only when user typed something */}
      {answerCode && userAttempt.trim() && (
        <CodeDiff userCode={userAttempt} correctCode={answerCode} />
      )}

      {/* Correct answer label */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
          Correct Answer
        </span>
      </div>

      {/* Answer text */}
      {answer && (
        <p className="text-base text-[--foreground] leading-relaxed">{answer}</p>
      )}

      {/* Answer code */}
      {answerCode && (
        <pre className="font-mono text-sm bg-white/5 border border-green-500/25 rounded-xl p-4 overflow-x-auto text-green-300 leading-relaxed">
          <code className={language ? `language-${language}` : undefined}>{answerCode}</code>
        </pre>
      )}

      {/* Explanation */}
      {explanation && (
        <p className="text-sm text-[--muted-foreground] leading-relaxed border-l-2 border-white/10 pl-3">
          {explanation}
        </p>
      )}
    </div>
  );
}
