/**
 * Flashcard seed data — JavaScript (ES2024).
 *
 * Every code snippet has been verified against:
 *   - MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
 *   - ECMAScript spec: https://tc39.es/ecma262/
 *
 * Structure: front.prompt = question, front.code = optional setup code,
 *            back.prompt  = answer explanation, back.code = correct answer code.
 */

import type { FlashcardSeed } from './flashcards-python.js';

export const jsFlashcards: FlashcardSeed[] = [
  // ── Variables & Data Types ────────────────────────────────────────────────
  {
    sectionSlug: 'js-variables-data-types',
    questionType: 'fill_blank',
    front: {
      prompt: 'What are the 7 primitive types in JavaScript?',
      language: 'javascript',
    },
    back: {
      prompt: 'The 7 primitives are: string, number, bigint, boolean, undefined, null, and symbol. Everything else (including arrays and functions) is an object.',
      code: 'typeof "hello"    // "string"\ntypeof 42         // "number"\ntypeof 42n        // "bigint"\ntypeof true       // "boolean"\ntypeof undefined  // "undefined"\ntypeof null       // "object" (historic bug)\ntypeof Symbol()   // "symbol"',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['types', 'primitives'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-variables-data-types',
    questionType: 'multiple_choice',
    front: {
      prompt: 'What is the key difference between let and const?',
    },
    back: {
      prompt: '`const` prevents reassignment of the binding but does NOT make the value immutable. A const array/object can still be mutated. `let` allows reassignment.',
      code: 'const arr = [1, 2];\narr.push(3);      // OK — mutating the object\n// arr = [4, 5];  // TypeError — cannot reassign\n\nlet x = 10;\nx = 20;           // OK — reassignment allowed',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['let', 'const', 'scoping'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-variables-data-types',
    questionType: 'free_recall',
    front: {
      prompt: 'True or False: `typeof null` returns "null" in JavaScript.',
    },
    back: {
      prompt: 'False. `typeof null` returns "object". This is a well-known historic bug in JS that cannot be fixed without breaking the web. Use `value === null` for null checks.',
      code: '>>> typeof null\n"object"\n>>> null === null\ntrue',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['typeof', 'null'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-variables-data-types',
    questionType: 'fill_blank',
    front: {
      prompt: 'What is the Temporal Dead Zone (TDZ)?',
      language: 'javascript',
    },
    back: {
      prompt: 'The TDZ is the period between entering a scope and the let/const declaration being executed. Accessing the variable in this zone throws a ReferenceError. var does not have a TDZ — it is hoisted and initialized to undefined.',
      code: '// console.log(x); // ReferenceError: TDZ\nlet x = 10;\nconsole.log(x);    // 10\n\nconsole.log(y);    // undefined (var is hoisted)\nvar y = 20;',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 4,
    tags: ['TDZ', 'hoisting'],
    isPublished: true,
  },

  // ── Strings & Template Literals ───────────────────────────────────────────
  {
    sectionSlug: 'js-strings-template-literals',
    questionType: 'code_completion',
    front: {
      prompt: 'Write a tagged template function `highlight` that wraps interpolated values in <strong> tags.',
      language: 'javascript',
    },
    back: {
      prompt: 'Tagged templates receive an array of string parts and the interpolated values as separate arguments.',
      code: 'function highlight(strings, ...values) {\n  return strings.reduce((result, str, i) => {\n    const val = values[i] !== undefined\n      ? `<strong>${values[i]}</strong>`\n      : "";\n    return result + str + val;\n  }, "");\n}\n\nconst name = "World";\nhighlight`Hello, ${name}!`;\n// "Hello, <strong>World</strong>!"',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['template-literals', 'tagged-templates'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-strings-template-literals',
    questionType: 'code_completion',
    front: {
      prompt: 'Use template literals to create a multi-line string with embedded expression.',
      language: 'javascript',
    },
    back: {
      prompt: 'Template literals (backticks) support multi-line strings and ${expression} interpolation natively.',
      code: 'const user = "Alice";\nconst message = `Hello, ${user}!\nWelcome to the app.\nToday is ${new Date().toLocaleDateString()}.`;',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['template-literals', 'multiline'],
    isPublished: true,
  },

  // ── Arrays ────────────────────────────────────────────────────────────────
  {
    sectionSlug: 'js-arrays',
    questionType: 'code_completion',
    front: {
      prompt: 'Use map() and filter() to get the squares of only even numbers from [1, 2, 3, 4, 5].',
      language: 'javascript',
    },
    back: {
      prompt: 'filter() selects elements matching a predicate, map() transforms each element. Chain them for functional-style pipelines.',
      code: '[1, 2, 3, 4, 5]\n  .filter(n => n % 2 === 0)\n  .map(n => n ** 2);\n// [4, 16]',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['arrays', 'map', 'filter'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-arrays',
    questionType: 'code_completion',
    front: {
      prompt: 'Use reduce() to sum all numbers in the array [10, 20, 30].',
      language: 'javascript',
    },
    back: {
      prompt: 'reduce(callback, initialValue) iterates left-to-right, accumulating a result. The callback receives (accumulator, currentValue, index, array).',
      code: '[10, 20, 30].reduce((sum, n) => sum + n, 0);\n// 60',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['arrays', 'reduce'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-arrays',
    questionType: 'fill_blank',
    front: {
      prompt: 'What does Array.prototype.at(-1) return?',
      language: 'javascript',
    },
    back: {
      prompt: 'The at() method (ES2022) accepts negative integers to index from the end. at(-1) returns the last element, like Python\'s list[-1].',
      code: '[10, 20, 30].at(-1);  // 30\n[10, 20, 30].at(0);   // 10',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['arrays', 'at'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-arrays',
    questionType: 'code_completion',
    front: {
      prompt: 'Flatten the nested array [[1, 2], [3, [4, 5]]] completely using flat().',
      language: 'javascript',
    },
    back: {
      prompt: 'flat(depth) creates a new array with sub-array elements concatenated up to the specified depth. Infinity flattens all levels.',
      code: '[[1, 2], [3, [4, 5]]].flat(Infinity);\n// [1, 2, 3, 4, 5]',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 4,
    tags: ['arrays', 'flat'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-arrays',
    questionType: 'code_completion',
    front: {
      prompt: 'Use destructuring to swap two variables a and b without a temp variable.',
      language: 'javascript',
    },
    back: {
      prompt: 'Array destructuring assignment can swap variables in one expression.',
      code: 'let a = 1, b = 2;\n[a, b] = [b, a];\n// a = 2, b = 1',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 5,
    tags: ['destructuring', 'swap'],
    isPublished: true,
  },

  // ── Objects ───────────────────────────────────────────────────────────────
  {
    sectionSlug: 'js-objects',
    questionType: 'code_completion',
    front: {
      prompt: 'Use optional chaining to safely access a deeply nested property user.address.city that might not exist.',
      language: 'javascript',
    },
    back: {
      prompt: 'Optional chaining (?.) short-circuits to undefined if any part of the chain is null/undefined. No TypeError thrown.',
      code: 'const city = user?.address?.city;\n// undefined if user or address is null/undefined\n\n// Also works with methods and bracket notation:\nuser?.getAddress?.()\nuser?.["address"]?.["city"]',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['optional-chaining', 'objects'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-objects',
    questionType: 'code_completion',
    front: {
      prompt: 'Use the nullish coalescing operator to provide a default value when a variable is null or undefined.',
      language: 'javascript',
    },
    back: {
      prompt: '?? returns the right operand only when the left is null or undefined (not for 0, "", or false like || would).',
      code: 'const port = config.port ?? 3000;\n// If config.port is null/undefined → 3000\n// If config.port is 0 → 0 (not 3000!)\n\n// Compare with ||:\nconst portOr = config.port || 3000;\n// If config.port is 0 → 3000 (treats 0 as falsy)',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['nullish-coalescing', 'operators'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-objects',
    questionType: 'code_completion',
    front: {
      prompt: 'Use Object.entries() and destructuring to iterate over {a: 1, b: 2}.',
      language: 'javascript',
    },
    back: {
      prompt: 'Object.entries() returns an array of [key, value] pairs. Destructure in for…of for clean iteration.',
      code: 'for (const [key, value] of Object.entries({ a: 1, b: 2 })) {\n  console.log(`${key}: ${value}`);\n}\n// "a: 1"\n// "b: 2"',
      language: 'javascript',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['Object.entries', 'iteration'],
    isPublished: true,
  },

  // ── Functions ─────────────────────────────────────────────────────────────
  {
    sectionSlug: 'js-functions',
    questionType: 'fill_blank',
    front: {
      prompt: 'What is the key difference between arrow functions and regular functions regarding `this`?',
      language: 'javascript',
    },
    back: {
      prompt: 'Arrow functions do not have their own `this` binding. They lexically capture `this` from the enclosing scope. Regular functions have their own `this` determined by how they are called.',
      code: 'const obj = {\n  name: "Alice",\n  // Regular function: `this` is obj\n  greet() {\n    setTimeout(function () {\n      console.log(this.name); // undefined (this = global/window)\n    }, 100);\n  },\n  // Arrow: `this` is inherited from greet()\n  greetArrow() {\n    setTimeout(() => {\n      console.log(this.name); // "Alice"\n    }, 100);\n  },\n};',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['arrow-functions', 'this'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-functions',
    questionType: 'code_completion',
    front: {
      prompt: 'Write a function with default parameters and rest parameters.',
      language: 'javascript',
    },
    back: {
      prompt: 'Default params use `=`. Rest params use `...` and must be last. Rest collects remaining arguments into an array.',
      code: 'function log(level = "info", ...messages) {\n  console.log(`[${level.toUpperCase()}]`, ...messages);\n}\n\nlog("warn", "disk full", "cleanup needed");\n// [WARN] disk full cleanup needed\n\nlog(undefined, "started");\n// [INFO] started',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['default-params', 'rest'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-functions',
    questionType: 'code_completion',
    front: {
      prompt: 'Create a closure that maintains a private counter.',
      language: 'javascript',
    },
    back: {
      prompt: 'A closure is a function that captures variables from its lexical scope. The inner function retains access even after the outer function returns.',
      code: 'function createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count,\n  };\n}\n\nconst counter = createCounter();\ncounter.increment(); // 1\ncounter.increment(); // 2\ncounter.getCount();  // 2',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 3,
    tags: ['closures'],
    isPublished: true,
  },

  // ── Destructuring & Spread ────────────────────────────────────────────────
  {
    sectionSlug: 'js-destructuring-spread',
    questionType: 'code_completion',
    front: {
      prompt: 'Use nested object destructuring with default values and renaming.',
      language: 'javascript',
    },
    back: {
      prompt: 'Destructuring supports renaming (: newName), defaults (= value), and nesting. Combine them for complex extractions.',
      code: 'const response = {\n  data: { user: { name: "Alice" } },\n  status: 200,\n};\n\nconst {\n  data: { user: { name: userName, age = 25 } },\n  status: httpStatus,\n} = response;\n\n// userName = "Alice", age = 25, httpStatus = 200',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['destructuring', 'defaults'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-destructuring-spread',
    questionType: 'code_completion',
    front: {
      prompt: 'Create a shallow clone of an object with one property overridden using the spread operator.',
      language: 'javascript',
    },
    back: {
      prompt: 'Object spread creates a shallow copy. Later properties override earlier ones. This is the standard pattern for immutable updates.',
      code: 'const original = { a: 1, b: 2, c: 3 };\nconst updated = { ...original, b: 99 };\n// { a: 1, b: 99, c: 3 }',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['spread', 'immutability'],
    isPublished: true,
  },

  // ── Error Handling ────────────────────────────────────────────────────────
  {
    sectionSlug: 'js-error-handling',
    questionType: 'code_completion',
    front: {
      prompt: 'Create a custom error class with an error cause chain (ES2022).',
      language: 'javascript',
    },
    back: {
      prompt: 'ES2022 added the `cause` option to Error constructors for explicit error chaining.',
      code: 'class DatabaseError extends Error {\n  constructor(message, options) {\n    super(message, options);\n    this.name = "DatabaseError";\n  }\n}\n\ntry {\n  throw new TypeError("connection refused");\n} catch (err) {\n  throw new DatabaseError("query failed", { cause: err });\n}\n// error.cause → TypeError: connection refused',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['errors', 'cause'],
    isPublished: true,
  },

  // ── Promises & Async/Await ────────────────────────────────────────────────
  {
    sectionSlug: 'js-promises-async-await',
    questionType: 'code_completion',
    front: {
      prompt: 'Use Promise.allSettled() to run multiple promises and handle both successes and failures.',
      language: 'javascript',
    },
    back: {
      prompt: 'Promise.allSettled() waits for all promises to settle (fulfill or reject). Each result has a `status` of "fulfilled" or "rejected".',
      code: 'const results = await Promise.allSettled([\n  fetch("/api/users"),\n  fetch("/api/posts"),\n  fetch("/api/bad-endpoint"),\n]);\n\nresults.forEach((result) => {\n  if (result.status === "fulfilled") {\n    console.log("Success:", result.value);\n  } else {\n    console.log("Failed:", result.reason);\n  }\n});',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['promises', 'allSettled'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-promises-async-await',
    questionType: 'code_completion',
    front: {
      prompt: 'Write an async function with proper error handling using try/catch.',
      language: 'javascript',
    },
    back: {
      prompt: 'async functions always return a Promise. `await` pauses execution until the promise settles. Wrap in try/catch for error handling.',
      code: 'async function fetchUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}`);\n    }\n    return await response.json();\n  } catch (error) {\n    console.error("Failed to fetch user:", error);\n    throw error; // re-throw for caller to handle\n  }\n}',
      language: 'javascript',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['async', 'await', 'error-handling'],
    isPublished: true,
  },

  // ── Classes & Prototypes ──────────────────────────────────────────────────
  {
    sectionSlug: 'js-classes-prototypes',
    questionType: 'code_completion',
    front: {
      prompt: 'Create a class with private fields (#) and a static factory method.',
      language: 'javascript',
    },
    back: {
      prompt: 'Private fields (ES2022) use # prefix and are truly private — not accessible outside the class body. Static methods belong to the class itself.',
      code: 'class BankAccount {\n  #balance;\n\n  constructor(initialBalance) {\n    this.#balance = initialBalance;\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n\n  deposit(amount) {\n    this.#balance += amount;\n  }\n\n  static create(amount = 0) {\n    return new BankAccount(amount);\n  }\n}\n\nconst acct = BankAccount.create(100);\nacct.deposit(50);\nacct.balance;    // 150\n// acct.#balance; // SyntaxError',
      language: 'javascript',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['classes', 'private-fields', 'static'],
    isPublished: true,
  },

  // ── Iterators & Generators ────────────────────────────────────────────────
  {
    sectionSlug: 'js-iterators-generators',
    questionType: 'code_completion',
    front: {
      prompt: 'Make an object iterable by implementing Symbol.iterator.',
      language: 'javascript',
    },
    back: {
      prompt: 'The iterable protocol requires a [Symbol.iterator]() method that returns an iterator (object with next()). This enables for…of and spread.',
      code: 'const range = {\n  from: 1,\n  to: 5,\n  [Symbol.iterator]() {\n    let current = this.from;\n    const last = this.to;\n    return {\n      next() {\n        return current <= last\n          ? { value: current++, done: false }\n          : { done: true };\n      },\n    };\n  },\n};\n\n[...range]; // [1, 2, 3, 4, 5]',
      language: 'javascript',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['iterators', 'Symbol.iterator'],
    isPublished: true,
  },
  {
    sectionSlug: 'js-iterators-generators',
    questionType: 'code_completion',
    front: {
      prompt: 'Write a generator function that yields values from a binary tree in-order.',
      language: 'javascript',
    },
    back: {
      prompt: 'Generators (function*) use `yield` to pause and resume. `yield*` delegates to another iterable/generator.',
      code: 'function* inOrder(node) {\n  if (node === null) return;\n  yield* inOrder(node.left);\n  yield node.value;\n  yield* inOrder(node.right);\n}\n\n// Usage with a tree: { value: 2, left: { value: 1, ... }, right: { value: 3, ... } }\n// [...inOrder(tree)] → [1, 2, 3]',
      language: 'javascript',
    },
    difficulty: 'advanced',
    order: 2,
    tags: ['generators', 'yield*'],
    isPublished: true,
  },

  // ── Map, Set & WeakRef ────────────────────────────────────────────────────
  {
    sectionSlug: 'js-map-set-weakref',
    questionType: 'fill_blank',
    front: {
      prompt: 'What advantage does Map have over a plain object for key-value storage?',
      language: 'javascript',
    },
    back: {
      prompt: 'Map allows any value as a key (objects, functions, primitives). It maintains insertion order, has a .size property, and is optimized for frequent additions/deletions. Plain objects only support string/symbol keys.',
      code: 'const map = new Map();\nconst objKey = { id: 1 };\n\nmap.set(objKey, "data");\nmap.set(42, "number key");\nmap.get(objKey);  // "data"\nmap.size;         // 2\n\n// Plain objects coerce keys to strings:\nconst obj = {};\nobj[objKey] = "data";\n// Key becomes "[object Object]"',
      language: 'javascript',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['Map', 'objects'],
    isPublished: true,
  },

  // ── Proxies & Reflect ─────────────────────────────────────────────────────
  {
    sectionSlug: 'js-proxies-reflect',
    questionType: 'code_completion',
    front: {
      prompt: 'Create a Proxy that logs all property accesses on an object.',
      language: 'javascript',
    },
    back: {
      prompt: 'Proxy wraps a target with handler traps. The `get` trap intercepts property reads. Reflect.get preserves default behavior.',
      code: 'const handler = {\n  get(target, prop, receiver) {\n    console.log(`Accessing: ${String(prop)}`);\n    return Reflect.get(target, prop, receiver);\n  },\n};\n\nconst user = { name: "Alice", age: 30 };\nconst proxy = new Proxy(user, handler);\nproxy.name; // logs "Accessing: name", returns "Alice"',
      language: 'javascript',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['Proxy', 'Reflect', 'metaprogramming'],
    isPublished: true,
  },
];
