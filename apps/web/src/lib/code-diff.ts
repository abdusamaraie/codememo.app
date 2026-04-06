// Pure TypeScript — no platform dependencies.

export type DiffOp = {
  type: 'same' | 'del' | 'ins';
  value: string;
};

export type LineDiff = {
  isSame: boolean;
  ops: DiffOp[];
};

/** Build LCS length table for two char arrays. */
function lcsTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

/** Character-level diff between two strings. */
export function diffChars(user: string, correct: string): DiffOp[] {
  const a = [...user];
  const b = [...correct];
  const dp = lcsTable(a, b);
  const ops: DiffOp[] = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ type: 'same', value: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'ins', value: b[j - 1] });
      j--;
    } else {
      ops.unshift({ type: 'del', value: a[i - 1] });
      i--;
    }
  }

  return ops;
}

/** Line-by-line diff, then char-level within each changed line. */
export function diffCode(user: string, correct: string): LineDiff[] {
  const userLines = user.split('\n');
  const correctLines = correct.split('\n');
  const maxLen = Math.max(userLines.length, correctLines.length);

  return Array.from({ length: maxLen }, (_, idx) => {
    const u = userLines[idx] ?? '';
    const c = correctLines[idx] ?? '';
    const ops = diffChars(u, c);
    return { isSame: u === c, ops };
  });
}

/** Returns 0–100 similarity between user attempt and correct answer. */
export function similarity(user: string, correct: string): number {
  if (!user && !correct) return 100;
  if (!user || !correct) return 0;
  const ops = diffChars(user.trim(), correct.trim());
  const sameCount = ops.filter((o) => o.type === 'same').length;
  const total = Math.max(user.trim().length, correct.trim().length);
  return total === 0 ? 100 : Math.round((sameCount / total) * 100);
}
