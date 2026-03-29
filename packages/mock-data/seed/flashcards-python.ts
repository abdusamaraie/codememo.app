/**
 * Flashcard seed data — Python.
 *
 * Every code snippet has been verified against:
 *   - Python 3.12+ official docs: https://docs.python.org/3/
 *   - PEP index: https://peps.python.org/
 *
 * Structure: front.prompt = question, front.code = optional setup code,
 *            back.prompt  = answer explanation, back.code = correct answer code.
 */

export interface FlashcardSeed {
  sectionSlug: string;
  questionType: 'fill-in-blank' | 'multiple-choice' | 'code-completion' | 'true-false';
  front: { prompt: string; code?: string; language?: string };
  back: { prompt: string; code?: string; language?: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  tags: string[];
  isPublished: boolean;
}

export const pythonFlashcards: FlashcardSeed[] = [
  // ── Variables & Data Types ────────────────────────────────────────────────
  {
    sectionSlug: 'py-variables-data-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What is the output of type(42)?',
      language: 'python',
    },
    back: {
      prompt: "In Python, integer literals like 42 are of type `int`. Python's int has arbitrary precision — there is no overflow.",
      code: ">>> type(42)\n<class 'int'>",
      language: 'python',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['types', 'int'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-variables-data-types',
    questionType: 'multiple-choice',
    front: {
      prompt: 'Which of the following is NOT a valid Python variable name?',
    },
    back: {
      prompt: 'Python identifiers cannot start with a digit. `2fast` is invalid. Underscores and letters (including Unicode) are valid starting characters.',
      code: '# Valid:   _name, café, __init__\n# Invalid: 2fast, class (reserved keyword)',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['variables', 'naming'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-variables-data-types',
    questionType: 'true-false',
    front: {
      prompt: 'True or False: In Python 3, dividing two integers with / always returns a float.',
    },
    back: {
      prompt: 'True. The `/` operator performs true division and always returns a float, even if both operands are int. Use `//` for floor division.',
      code: '>>> 10 / 2\n5.0\n>>> 10 // 2\n5',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['operators', 'division'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-variables-data-types',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a single expression to check if a variable x is of type str.',
      language: 'python',
    },
    back: {
      prompt: '`isinstance()` is preferred over `type() ==` because it respects inheritance.',
      code: 'isinstance(x, str)',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 4,
    tags: ['types', 'isinstance'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-variables-data-types',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What does `None` represent in Python, and what is its type?',
      language: 'python',
    },
    back: {
      prompt: '`None` is the sole instance of `NoneType`. It represents the absence of a value. Functions without an explicit return statement return `None`.',
      code: ">>> type(None)\n<class 'NoneType'>\n>>> x = None\n>>> x is None\nTrue",
      language: 'python',
    },
    difficulty: 'beginner',
    order: 5,
    tags: ['None', 'NoneType'],
    isPublished: true,
  },

  // ── Strings & Formatting ──────────────────────────────────────────────────
  {
    sectionSlug: 'py-strings-formatting',
    questionType: 'code-completion',
    front: {
      prompt: 'Write an f-string that formats the variable `price` (a float) to exactly 2 decimal places.',
      language: 'python',
    },
    back: {
      prompt: 'F-strings support format specifiers after a colon. `.2f` means 2 decimal fixed-point notation.',
      code: 'f"Total: {price:.2f}"',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['f-strings', 'formatting'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-strings-formatting',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What does `"hello"[1:4]` return?',
      language: 'python',
    },
    back: {
      prompt: 'String slicing uses `[start:stop]` where start is inclusive and stop is exclusive. Characters at indices 1, 2, 3 → "ell".',
      code: '>>> "hello"[1:4]\n\'ell\'',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['slicing', 'strings'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-strings-formatting',
    questionType: 'code-completion',
    front: {
      prompt: 'How do you create a multi-line string that preserves newlines?',
      language: 'python',
    },
    back: {
      prompt: 'Triple quotes (single or double) create multi-line string literals, preserving internal newlines.',
      code: 'text = """Line one\nLine two\nLine three"""',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['strings', 'multiline'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-strings-formatting',
    questionType: 'true-false',
    front: {
      prompt: 'True or False: Strings in Python are mutable.',
    },
    back: {
      prompt: 'False. Python strings are immutable. Operations like replace() or concatenation create new string objects.',
      code: '>>> s = "hello"\n>>> s[0] = "H"  # TypeError: \'str\' object does not support item assignment',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 4,
    tags: ['strings', 'immutability'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-strings-formatting',
    questionType: 'code-completion',
    front: {
      prompt: 'Split the string "a,b,c" into a list of individual characters using a comma delimiter.',
      language: 'python',
    },
    back: {
      prompt: 'str.split(sep) splits a string by the given separator and returns a list of substrings.',
      code: '>>> "a,b,c".split(",")\n[\'a\', \'b\', \'c\']',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 5,
    tags: ['strings', 'split'],
    isPublished: true,
  },

  // ── Lists & Tuples ────────────────────────────────────────────────────────
  {
    sectionSlug: 'py-lists-tuples',
    questionType: 'code-completion',
    front: {
      prompt: 'Create a list of squares for numbers 0–4 using a list comprehension.',
      language: 'python',
    },
    back: {
      prompt: 'List comprehensions follow the pattern [expression for item in iterable].',
      code: 'squares = [x**2 for x in range(5)]\n# [0, 1, 4, 9, 16]',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['lists', 'comprehension'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-lists-tuples',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What does `[1, 2, 3][-1]` return?',
      language: 'python',
    },
    back: {
      prompt: 'Negative indexing counts from the end. Index -1 is the last element.',
      code: '>>> [1, 2, 3][-1]\n3',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['lists', 'indexing'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-lists-tuples',
    questionType: 'true-false',
    front: {
      prompt: 'True or False: Tuples are mutable in Python.',
    },
    back: {
      prompt: 'False. Tuples are immutable — once created, their elements cannot be reassigned. However, if a tuple contains mutable objects (like lists), those inner objects can still be modified.',
      code: '>>> t = (1, [2, 3])\n>>> t[0] = 99     # TypeError\n>>> t[1].append(4) # OK → (1, [2, 3, 4])',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['tuples', 'immutability'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-lists-tuples',
    questionType: 'code-completion',
    front: {
      prompt: 'Unpack a tuple (1, 2, 3) into variables a, b, c in a single statement.',
      language: 'python',
    },
    back: {
      prompt: 'Python supports tuple unpacking: the number of variables on the left must match the tuple length (or use * for extended unpacking).',
      code: 'a, b, c = (1, 2, 3)',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 4,
    tags: ['tuples', 'unpacking'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-lists-tuples',
    questionType: 'code-completion',
    front: {
      prompt: 'Use the * operator to unpack the first element and capture the rest of a list [1, 2, 3, 4, 5].',
      language: 'python',
    },
    back: {
      prompt: 'Extended unpacking (PEP 3132) uses * to collect remaining items into a list.',
      code: 'first, *rest = [1, 2, 3, 4, 5]\n# first = 1, rest = [2, 3, 4, 5]',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 5,
    tags: ['unpacking', 'star'],
    isPublished: true,
  },

  // ── Dictionaries & Sets ───────────────────────────────────────────────────
  {
    sectionSlug: 'py-dicts-sets',
    questionType: 'code-completion',
    front: {
      prompt: 'Create a dictionary comprehension that maps numbers 1–5 to their squares.',
      language: 'python',
    },
    back: {
      prompt: 'Dict comprehensions use {key_expr: value_expr for item in iterable}.',
      code: 'squares = {n: n**2 for n in range(1, 6)}\n# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['dicts', 'comprehension'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-dicts-sets',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What method safely gets a value from a dict, returning a default if the key is missing?',
      language: 'python',
    },
    back: {
      prompt: '`dict.get(key, default)` returns the value for key if present, otherwise returns default (None if omitted). Unlike `d[key]`, it never raises KeyError.',
      code: '>>> d = {"a": 1}\n>>> d.get("b", 0)\n0\n>>> d.get("a")\n1',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 2,
    tags: ['dicts', 'get'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-dicts-sets',
    questionType: 'code-completion',
    front: {
      prompt: 'Compute the intersection of two sets: {1, 2, 3} and {2, 3, 4}.',
      language: 'python',
    },
    back: {
      prompt: 'Use the & operator or .intersection() method. Both return elements present in both sets.',
      code: '>>> {1, 2, 3} & {2, 3, 4}\n{2, 3}',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 3,
    tags: ['sets', 'intersection'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-dicts-sets',
    questionType: 'true-false',
    front: {
      prompt: 'True or False: Python dicts preserve insertion order as of Python 3.7+.',
    },
    back: {
      prompt: 'True. As of CPython 3.6 (implementation detail) and guaranteed by the language spec from Python 3.7+, dictionaries maintain insertion order.',
      code: '>>> d = {"b": 2, "a": 1, "c": 3}\n>>> list(d.keys())\n[\'b\', \'a\', \'c\']',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 4,
    tags: ['dicts', 'ordering'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-dicts-sets',
    questionType: 'code-completion',
    front: {
      prompt: 'Merge two dicts: d1 = {"a": 1} and d2 = {"b": 2} using the merge operator (Python 3.9+).',
      language: 'python',
    },
    back: {
      prompt: 'PEP 584 introduced the | operator for dict merging. The right-hand dict values take precedence for duplicate keys.',
      code: 'd1 = {"a": 1}\nd2 = {"b": 2}\nmerged = d1 | d2\n# {"a": 1, "b": 2}',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 5,
    tags: ['dicts', 'merge'],
    isPublished: true,
  },

  // ── Control Flow ──────────────────────────────────────────────────────────
  {
    sectionSlug: 'py-control-flow',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a match/case statement (Python 3.10+) that matches the variable `command` against "quit", "go north", and a default case.',
      language: 'python',
    },
    back: {
      prompt: 'PEP 634 introduced structural pattern matching. The `_` wildcard matches anything (like default in switch).',
      code: 'match command:\n    case "quit":\n        print("Exiting")\n    case "go north":\n        print("Moving north")\n    case _:\n        print("Unknown command")',
      language: 'python',
    },
    difficulty: 'beginner',
    order: 1,
    tags: ['match', 'pattern-matching'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-control-flow',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What does the walrus operator (:=) do?',
      language: 'python',
    },
    back: {
      prompt: 'PEP 572: The walrus operator `:=` is an assignment expression — it assigns a value to a variable as part of an expression.',
      code: '# Read lines until empty\nwhile (line := input()) != "":\n    print(line)',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['walrus', 'assignment-expression'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-control-flow',
    questionType: 'true-false',
    front: {
      prompt: 'True or False: A for loop in Python can have an else clause.',
    },
    back: {
      prompt: 'True. The else clause of a for/while loop runs only if the loop completes without hitting a break statement.',
      code: 'for n in range(5):\n    if n == 10:\n        break\nelse:\n    print("Loop completed without break")\n# Prints the message',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 3,
    tags: ['for', 'else'],
    isPublished: true,
  },

  // ── Functions ─────────────────────────────────────────────────────────────
  {
    sectionSlug: 'py-functions',
    questionType: 'code-completion',
    front: {
      prompt: 'Define a function `greet` that takes a name (str) and an optional greeting with default "Hello", and returns a formatted string.',
      language: 'python',
    },
    back: {
      prompt: 'Default argument values are evaluated once at function definition time. Use type hints for clarity.',
      code: 'def greet(name: str, greeting: str = "Hello") -> str:\n    return f"{greeting}, {name}!"',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['functions', 'defaults', 'type-hints'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-functions',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What is the difference between *args and **kwargs in a function signature?',
      language: 'python',
    },
    back: {
      prompt: '`*args` collects extra positional arguments into a tuple. `**kwargs` collects extra keyword arguments into a dict.',
      code: 'def example(*args, **kwargs):\n    print(args)    # (1, 2, 3)\n    print(kwargs)  # {"x": 10}\n\nexample(1, 2, 3, x=10)',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['args', 'kwargs'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-functions',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a lambda that takes two arguments and returns their sum.',
      language: 'python',
    },
    back: {
      prompt: 'Lambda expressions create anonymous functions: `lambda params: expression`.',
      code: 'add = lambda a, b: a + b\n# add(3, 4) → 7',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 3,
    tags: ['lambda'],
    isPublished: true,
  },

  // ── Error Handling ────────────────────────────────────────────────────────
  {
    sectionSlug: 'py-error-handling',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a try/except block that catches ValueError, with an else clause (runs on success) and finally clause.',
      language: 'python',
    },
    back: {
      prompt: 'The else clause runs only if no exception was raised. finally always runs, even if an exception propagated.',
      code: 'try:\n    value = int(input("Number: "))\nexcept ValueError as e:\n    print(f"Invalid: {e}")\nelse:\n    print(f"Got {value}")\nfinally:\n    print("Done")',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 1,
    tags: ['try', 'except', 'else', 'finally'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-error-handling',
    questionType: 'code-completion',
    front: {
      prompt: 'Define a custom exception class called InsufficientFundsError that includes an amount attribute.',
      language: 'python',
    },
    back: {
      prompt: 'Custom exceptions should inherit from Exception (or a more specific built-in). Use __init__ to store extra context.',
      code: 'class InsufficientFundsError(Exception):\n    def __init__(self, amount: float):\n        self.amount = amount\n        super().__init__(f"Insufficient funds: needed {amount}")',
      language: 'python',
    },
    difficulty: 'intermediate',
    order: 2,
    tags: ['exceptions', 'custom'],
    isPublished: true,
  },

  // ── Classes & OOP ─────────────────────────────────────────────────────────
  {
    sectionSlug: 'py-classes-oop',
    questionType: 'code-completion',
    front: {
      prompt: 'Create a dataclass `Point` with x and y float fields.',
      language: 'python',
    },
    back: {
      prompt: 'The @dataclass decorator (PEP 557) auto-generates __init__, __repr__, __eq__ and more based on annotated fields.',
      code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float',
      language: 'python',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['dataclass', 'classes'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-classes-oop',
    questionType: 'code-completion',
    front: {
      prompt: 'Add a read-only property `area` to a Circle class that computes π × r².',
      language: 'python',
    },
    back: {
      prompt: '@property creates a getter that behaves like an attribute. Without a setter, the property is read-only.',
      code: 'import math\n\nclass Circle:\n    def __init__(self, radius: float):\n        self.radius = radius\n\n    @property\n    def area(self) -> float:\n        return math.pi * self.radius ** 2',
      language: 'python',
    },
    difficulty: 'advanced',
    order: 2,
    tags: ['property', 'classes'],
    isPublished: true,
  },
  {
    sectionSlug: 'py-classes-oop',
    questionType: 'fill-in-blank',
    front: {
      prompt: 'What does super().__init__() do inside a child class __init__?',
      language: 'python',
    },
    back: {
      prompt: 'super() returns a proxy object that delegates method calls to the parent class in the MRO (Method Resolution Order). Calling super().__init__() ensures the parent class is properly initialized.',
      code: 'class Animal:\n    def __init__(self, name: str):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name: str, breed: str):\n        super().__init__(name)\n        self.breed = breed',
      language: 'python',
    },
    difficulty: 'advanced',
    order: 3,
    tags: ['super', 'inheritance'],
    isPublished: true,
  },

  // ── Decorators & Closures ─────────────────────────────────────────────────
  {
    sectionSlug: 'py-decorators-closures',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a simple timing decorator that prints how long a function takes to execute.',
      language: 'python',
    },
    back: {
      prompt: 'A decorator wraps a function. Use @functools.wraps to preserve the original function metadata.',
      code: 'import time\nfrom functools import wraps\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__} took {elapsed:.4f}s")\n        return result\n    return wrapper',
      language: 'python',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['decorators', 'wraps'],
    isPublished: true,
  },

  // ── Iterators & Generators ────────────────────────────────────────────────
  {
    sectionSlug: 'py-iterators-generators',
    questionType: 'code-completion',
    front: {
      prompt: 'Write a generator function that yields the Fibonacci sequence indefinitely.',
      language: 'python',
    },
    back: {
      prompt: 'Generators use `yield` to produce values lazily. Each call to next() resumes where the generator left off.',
      code: 'def fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\n# Usage:\n# gen = fibonacci()\n# next(gen) → 0, next(gen) → 1, next(gen) → 1, ...',
      language: 'python',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['generators', 'yield'],
    isPublished: true,
  },

  // ── Async & Concurrency ───────────────────────────────────────────────────
  {
    sectionSlug: 'py-async-concurrency',
    questionType: 'code-completion',
    front: {
      prompt: 'Write an async function that fetches data from two URLs concurrently using asyncio.gather.',
      language: 'python',
    },
    back: {
      prompt: 'asyncio.gather() runs awaitables concurrently and returns results in the same order.',
      code: 'import asyncio\nimport aiohttp\n\nasync def fetch(session, url):\n    async with session.get(url) as resp:\n        return await resp.text()\n\nasync def main():\n    async with aiohttp.ClientSession() as session:\n        page1, page2 = await asyncio.gather(\n            fetch(session, "https://example.com/1"),\n            fetch(session, "https://example.com/2"),\n        )\n\nasyncio.run(main())',
      language: 'python',
    },
    difficulty: 'advanced',
    order: 1,
    tags: ['async', 'gather'],
    isPublished: true,
  },
];
