import type { Metadata } from 'next';
import { FlashcardDeck } from '@/components/study/FlashcardDeck';
import type { StudyCard } from '@/components/study/FlashcardDeck';

export const metadata: Metadata = { title: 'Study — CodeMemo' };

// Mock card data keyed by language. In production, fetch from Convex based on
// language + section params. Cards are replaced with real Payload/Convex data
// once `npx convex dev` generates the API types.
const MOCK_CARDS: Record<string, StudyCard[]> = {
  python: [
    {
      id: 'py-lc-1',
      question: 'Write a list comprehension that squares all even numbers from 0–9.',
      language: 'python',
      hint: 'Use the modulo operator `%` to filter even numbers.',
      answer: 'A list comprehension with a condition filters and transforms in one line.',
      answerCode: '[x**2 for x in range(10) if x % 2 == 0]',
      explanation: '`range(10)` yields 0–9. The `if x % 2 == 0` guard keeps only even numbers. `x**2` squares each.',
    },
    {
      id: 'py-lc-2',
      question: 'Flatten a 2D list `matrix = [[1,2],[3,4],[5,6]]` into a 1D list using a comprehension.',
      language: 'python',
      answer: 'Nest two `for` clauses in the comprehension.',
      answerCode: '[x for row in matrix for x in row]',
      explanation: 'The outer `for row in matrix` iterates rows; the inner `for x in row` iterates elements.',
    },
    {
      id: 'py-lc-3',
      question: 'Create a dict mapping each word in `words` to its length.',
      language: 'python',
      hint: 'Dict comprehensions use `{key: value for ...}` syntax.',
      answer: 'Use a dict comprehension with `len()` as the value expression.',
      answerCode: '{word: len(word) for word in words}',
      explanation: 'Dict comprehensions mirror list comprehensions but wrap in `{}` and use `key: value`.',
    },
    {
      id: 'py-gen-1',
      question: 'What does `yield` do inside a Python function?',
      answer: 'It turns the function into a generator — pausing execution and returning a value to the caller without losing local state.',
      explanation: 'Generators are memory-efficient iterators; they compute values lazily on demand.',
    },
    {
      id: 'py-dec-1',
      question: 'Write a decorator `timer` that prints how long a function takes to run.',
      language: 'python',
      hint: 'Use `time.time()` before and after the wrapped call.',
      answer: 'Wrap the function, record start/end times, print the delta.',
      answerCode: `import time, functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper`,
      explanation: '`@functools.wraps(func)` preserves the wrapped function\'s `__name__` and docstring.',
    },
    {
      id: 'py-ctx-1',
      question: 'Implement a context manager class that prints "Enter" on entry and "Exit" on exit.',
      language: 'python',
      answer: 'Implement `__enter__` and `__exit__` dunder methods.',
      answerCode: `class Managed:
    def __enter__(self):
        print("Enter")
        return self
    def __exit__(self, *args):
        print("Exit")`,
      explanation: '`__exit__` receives exception info (type, value, traceback). Return `True` to suppress exceptions.',
    },
    {
      id: 'py-type-1',
      question: 'Annotate a function `greet` that takes a `name: str` and an optional `times: int` (default 1) and returns `str`.',
      language: 'python',
      hint: 'Use `Optional` from `typing`, or Python 3.10+ `X | None` syntax.',
      answer: 'Annotate parameters and return type; optional params use `Optional[int]` or `int | None`.',
      answerCode: `from typing import Optional

def greet(name: str, times: Optional[int] = 1) -> str:
    return (name + " ") * times`,
    },
    {
      id: 'py-async-1',
      question: 'Write an `async` function that fetches a URL with `aiohttp` and returns the response text.',
      language: 'python',
      answer: 'Define with `async def`, open a session, `await` the get call and the text coroutine.',
      answerCode: `import aiohttp

async def fetch(url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.text()`,
      explanation: '`async with` ensures the session closes even if an exception is raised.',
    },
  ],
  typescript: [
    {
      id: 'ts-gen-1',
      question: 'Write a generic `identity` function that returns its argument unchanged.',
      language: 'typescript',
      answer: 'Use a type parameter `<T>` on the function.',
      answerCode: 'function identity<T>(value: T): T {\n  return value;\n}',
    },
    {
      id: 'ts-util-1',
      question: 'What does `Partial<T>` do?',
      answer: 'It makes all properties of `T` optional (`?`), useful for update/patch patterns.',
      answerCode: 'type PartialUser = Partial<{ id: number; name: string }>;\n// { id?: number; name?: string }',
    },
    {
      id: 'ts-guard-1',
      question: 'Write a type guard that narrows `unknown` to `string`.',
      language: 'typescript',
      answer: 'Return a type predicate `value is string` using `typeof`.',
      answerCode: 'function isString(value: unknown): value is string {\n  return typeof value === "string";\n}',
    },
    {
      id: 'ts-union-1',
      question: 'Create a discriminated union for `Circle` and `Rectangle` shapes, then write a `getArea` function.',
      language: 'typescript',
      answer: 'Use a shared `kind` literal field as the discriminant, then switch on it.',
      answerCode: `type Circle    = { kind: "circle";    radius: number };
type Rectangle = { kind: "rectangle"; w: number; h: number };
type Shape = Circle | Rectangle;

function getArea(s: Shape): number {
  switch (s.kind) {
    case "circle":    return Math.PI * s.radius ** 2;
    case "rectangle": return s.w * s.h;
  }
}`,
    },
  ],
};

function getMockCards(language: string, _section: string): StudyCard[] {
  return MOCK_CARDS[language] ?? MOCK_CARDS.python;
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ language: string; section: string }>;
}) {
  const { language, section } = await params;
  const cards = getMockCards(language, section);
  const sectionTitle = `Section ${section}`;

  return (
    // Full-screen study mode — hide the app shell layout
    <div className="fixed inset-0 bg-[--background] z-50 flex flex-col">
      <FlashcardDeck
        cards={cards}
        sectionTitle={sectionTitle}
        language={language}
        backHref={`/path/${language}`}
      />
    </div>
  );
}
