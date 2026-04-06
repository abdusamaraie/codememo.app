import { getClientAppDataSource } from '@/lib/data-source';

export type AiHintResult = {
  source: 'curated' | 'ai';
  text: string;
};

export type AiExplainResult = {
  source: 'heuristic' | 'ai';
  text: string;
};

const DAILY_AI_LIMIT = 20;
const AI_USAGE_KEY = 'codememo-ai-usage';
const MOCK_AI_USED_TODAY = 7;

function todayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

type UsageMap = Record<string, number>;

function readUsage(): UsageMap {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(AI_USAGE_KEY) ?? '{}') as UsageMap;
  } catch {
    return {};
  }
}

function writeUsage(map: UsageMap) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AI_USAGE_KEY, JSON.stringify(map));
}

export function getRemainingAiRequests(now: Date = new Date()): number {
  if (typeof window !== 'undefined' && getClientAppDataSource() === 'mock') {
    return Math.max(0, DAILY_AI_LIMIT - MOCK_AI_USED_TODAY);
  }
  const map = readUsage();
  const used = map[todayKey(now)] ?? 0;
  return Math.max(0, DAILY_AI_LIMIT - used);
}

function consumeAiRequest(now: Date = new Date()): boolean {
  if (typeof window !== 'undefined' && getClientAppDataSource() === 'mock') {
    return true;
  }
  const map = readUsage();
  const key = todayKey(now);
  const used = map[key] ?? 0;
  if (used >= DAILY_AI_LIMIT) return false;
  map[key] = used + 1;
  writeUsage(map);
  return true;
}

export async function getProgressiveHint(params: {
  question: string;
  curatedHint?: string;
  language?: string;
  userAttempt: string;
}): Promise<AiHintResult> {
  const { question, curatedHint, language, userAttempt } = params;
  if (curatedHint) {
    return { source: 'curated', text: curatedHint };
  }

  if (!consumeAiRequest()) {
    return { source: 'ai', text: 'AI hint limit reached for today (20). Try again tomorrow.' };
  }

  // Placeholder until backend AI endpoint is wired. Uses deterministic fallback.
  const short = userAttempt.trim().slice(0, 120);
  const signal = short ? `Your attempt starts with: "${short}"` : 'You have not typed an attempt yet.';
  return {
    source: 'ai',
    text: `Think in terms of syntax shape first (${language ?? 'code'}). ${signal} Focus on delimiters, ordering, and required keywords in this prompt: "${question}"`,
  };
}

export async function explainFurther(params: {
  question: string;
  answerCode?: string;
  explanation?: string;
  userAttempt: string;
  language?: string;
}): Promise<AiExplainResult> {
  const { question, answerCode, explanation, userAttempt, language } = params;
  const base = explanation ?? 'Compare expected syntax to your attempt and fix token order.';
  const attemptEmpty = userAttempt.trim().length === 0;

  if (!consumeAiRequest()) {
    return { source: 'heuristic', text: `${base} (AI explain limit reached for today)` };
  }

  const heuristics = [
    `Prompt intent: ${question}`,
    `Language: ${language ?? 'generic'}`,
    attemptEmpty
      ? 'You did not submit an attempt. Try writing from memory first, then compare.'
      : `Your attempt differs from expected tokens. Check punctuation, keyword order, and nesting.`,
    answerCode ? `Reference answer starts with: ${answerCode.split('\n')[0]}` : '',
  ].filter(Boolean);

  return { source: 'ai', text: `${base}\n\n${heuristics.join('\n')}` };
}
