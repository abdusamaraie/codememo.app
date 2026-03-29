/**
 * Section seed data for Python and JavaScript.
 *
 * Sections are ordered progressively: fundamentals → intermediate → advanced.
 * Each section maps to a language via its slug (resolved at seed time).
 *
 * Source of truth for topic coverage:
 *   Python — https://docs.python.org/3/tutorial/
 *   JavaScript — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
 */

export interface SectionSeed {
  title: string;
  slug: string;
  languageSlug: string;
  description: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPublished: boolean;
}

// ─── Python Sections ──────────────────────────────────────────────────────────

export const pythonSections: SectionSeed[] = [
  {
    title: 'Variables & Data Types',
    slug: 'py-variables-data-types',
    languageSlug: 'python',
    description: 'Declaring variables, numeric types (int, float, complex), strings, booleans, and None.',
    order: 1,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Strings & Formatting',
    slug: 'py-strings-formatting',
    languageSlug: 'python',
    description: 'String methods, slicing, f-strings, format(), and raw strings.',
    order: 2,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Lists & Tuples',
    slug: 'py-lists-tuples',
    languageSlug: 'python',
    description: 'Creating, indexing, slicing, and mutating lists. Tuple packing/unpacking and immutability.',
    order: 3,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Dictionaries & Sets',
    slug: 'py-dicts-sets',
    languageSlug: 'python',
    description: 'Dict creation, access patterns, comprehensions. Set operations (union, intersection, difference).',
    order: 4,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Control Flow',
    slug: 'py-control-flow',
    languageSlug: 'python',
    description: 'if/elif/else, match/case (3.10+), for/while loops, break/continue, and the walrus operator.',
    order: 5,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Functions',
    slug: 'py-functions',
    languageSlug: 'python',
    description: 'def, return, default args, *args/**kwargs, type hints, and lambda expressions.',
    order: 6,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'List Comprehensions',
    slug: 'py-comprehensions',
    languageSlug: 'python',
    description: 'List, dict, and set comprehensions. Generator expressions and nested comprehensions.',
    order: 7,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Error Handling',
    slug: 'py-error-handling',
    languageSlug: 'python',
    description: 'try/except/else/finally, raising exceptions, custom exception classes, and exception groups.',
    order: 8,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Modules & Imports',
    slug: 'py-modules-imports',
    languageSlug: 'python',
    description: 'import, from…import, __name__, packages, relative imports, and __init__.py.',
    order: 9,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'File I/O',
    slug: 'py-file-io',
    languageSlug: 'python',
    description: 'open(), read/write modes, context managers (with statement), pathlib, and encoding.',
    order: 10,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Classes & OOP',
    slug: 'py-classes-oop',
    languageSlug: 'python',
    description: 'class, __init__, self, inheritance, super(), @property, dunder methods, and dataclasses.',
    order: 11,
    difficulty: 'advanced',
    isPublished: true,
  },
  {
    title: 'Decorators & Closures',
    slug: 'py-decorators-closures',
    languageSlug: 'python',
    description: 'Function decorators, @wraps, class decorators, closures, and functools utilities.',
    order: 12,
    difficulty: 'advanced',
    isPublished: true,
  },
  {
    title: 'Iterators & Generators',
    slug: 'py-iterators-generators',
    languageSlug: 'python',
    description: '__iter__/__next__, yield, generator expressions, itertools, and send/throw.',
    order: 13,
    difficulty: 'advanced',
    isPublished: true,
  },
  {
    title: 'Async & Concurrency',
    slug: 'py-async-concurrency',
    languageSlug: 'python',
    description: 'async/await, asyncio.run, event loops, aiohttp patterns, and asyncio.gather.',
    order: 14,
    difficulty: 'advanced',
    isPublished: true,
  },
];

// ─── JavaScript Sections ──────────────────────────────────────────────────────

export const jsSections: SectionSeed[] = [
  {
    title: 'Variables & Data Types',
    slug: 'js-variables-data-types',
    languageSlug: 'javascript',
    description: 'let, const, var scoping. Primitive types: string, number, bigint, boolean, undefined, null, symbol.',
    order: 1,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Strings & Template Literals',
    slug: 'js-strings-template-literals',
    languageSlug: 'javascript',
    description: 'String methods, template literals, tagged templates, and String.raw.',
    order: 2,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Arrays',
    slug: 'js-arrays',
    languageSlug: 'javascript',
    description: 'Array creation, destructuring, spread, map/filter/reduce, find, flat, and at().',
    order: 3,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Objects',
    slug: 'js-objects',
    languageSlug: 'javascript',
    description: 'Object literals, destructuring, computed keys, spread, Object.keys/values/entries, and optional chaining.',
    order: 4,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Control Flow',
    slug: 'js-control-flow',
    languageSlug: 'javascript',
    description: 'if/else, switch, ternary, for/for…of/for…in, while, break/continue, and labeled statements.',
    order: 5,
    difficulty: 'beginner',
    isPublished: true,
  },
  {
    title: 'Functions',
    slug: 'js-functions',
    languageSlug: 'javascript',
    description: 'Function declarations, expressions, arrow functions, default params, rest params, and closures.',
    order: 6,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Destructuring & Spread',
    slug: 'js-destructuring-spread',
    languageSlug: 'javascript',
    description: 'Array/object destructuring, nested patterns, default values, rest elements, and spread in calls.',
    order: 7,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Error Handling',
    slug: 'js-error-handling',
    languageSlug: 'javascript',
    description: 'try/catch/finally, Error types, custom errors, throwing, and error cause chaining.',
    order: 8,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Modules (ESM)',
    slug: 'js-modules-esm',
    languageSlug: 'javascript',
    description: 'import/export, named vs default exports, dynamic import(), re-exports, and module patterns.',
    order: 9,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Promises & Async/Await',
    slug: 'js-promises-async-await',
    languageSlug: 'javascript',
    description: 'Promise constructor, .then/.catch/.finally, async/await, Promise.all/allSettled/race/any.',
    order: 10,
    difficulty: 'intermediate',
    isPublished: true,
  },
  {
    title: 'Classes & Prototypes',
    slug: 'js-classes-prototypes',
    languageSlug: 'javascript',
    description: 'class, constructor, extends, super, static, private fields (#), and prototype chain.',
    order: 11,
    difficulty: 'advanced',
    isPublished: true,
  },
  {
    title: 'Iterators & Generators',
    slug: 'js-iterators-generators',
    languageSlug: 'javascript',
    description: 'Symbol.iterator, for…of protocol, function*, yield, yield*, and async generators.',
    order: 12,
    difficulty: 'advanced',
    isPublished: true,
  },
  {
    title: 'Map, Set & WeakRef',
    slug: 'js-map-set-weakref',
    languageSlug: 'javascript',
    description: 'Map/Set constructors, WeakMap/WeakSet, WeakRef, FinalizationRegistry, and use cases.',
    order: 13,
    difficulty: 'advanced',
    isPublished: true,
  },
  {
    title: 'Proxies & Reflect',
    slug: 'js-proxies-reflect',
    languageSlug: 'javascript',
    description: 'Proxy handler traps, Reflect API, revocable proxies, and meta-programming patterns.',
    order: 14,
    difficulty: 'advanced',
    isPublished: true,
  },
];

export const sections: SectionSeed[] = [...pythonSections, ...jsSections];
