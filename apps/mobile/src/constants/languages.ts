export const LANGUAGE_CATALOG = {
  python: {
    slug: 'python',
    name: 'Python',
    emoji: '🐍',
    color: '#3572A5',
  },
  javascript: {
    slug: 'javascript',
    name: 'JavaScript',
    emoji: '⚡',
    color: '#F7DF1E',
  },
  typescript: {
    slug: 'typescript',
    name: 'TypeScript',
    emoji: '🔷',
    color: '#3178C6',
  },
  go: {
    slug: 'go',
    name: 'Go',
    emoji: '🐹',
    color: '#00ADD8',
  },
} as const;

export const LANGUAGE_GRID = [
  { ...LANGUAGE_CATALOG.python, sections: 14 },
  { ...LANGUAGE_CATALOG.javascript, sections: 12 },
  { ...LANGUAGE_CATALOG.typescript, sections: 10 },
  { ...LANGUAGE_CATALOG.go, sections: 10 },
] as const;

export const HOME_CONTINUE_LANGUAGES = [
  { ...LANGUAGE_CATALOG.python, pct: 42 },
  { ...LANGUAGE_CATALOG.javascript, pct: 17 },
] as const;
