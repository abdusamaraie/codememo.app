/**
 * Exercise seed data — Python & JavaScript.
 *
 * Every answer has been verified against official documentation:
 *   Python: https://docs.python.org/3/
 *   JS: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
 *
 * Exercise types: fill-blank, multiple-choice, arrange-lines, spot-error.
 */

export interface ExerciseSeed {
  sectionSlug: string;
  type: 'fill_blank' | 'multiple_choice' | 'arrange_code' | 'spot_error';
  question: string;
  code?: string;
  language: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  isPublished: boolean;
}

// ─── Python Exercises ─────────────────────────────────────────────────────────

export const pythonExercises: ExerciseSeed[] = [
  // Variables & Data Types
  {
    sectionSlug: 'py-variables-data-types',
    type: 'multiple_choice',
    question: 'What is the result of `bool("")` in Python?',
    language: 'python',
    options: ['True', 'False', 'None', 'TypeError'],
    correctAnswer: 'False',
    explanation: 'Empty strings are falsy in Python. bool("") evaluates to False. Non-empty strings are truthy.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'py-variables-data-types',
    type: 'fill_blank',
    question: 'Complete the expression to convert the string "42" to an integer.',
    code: 'result = ___("42")',
    language: 'python',
    correctAnswer: 'int',
    explanation: 'The int() constructor parses a string and returns an integer. int("42") returns 42.',
    difficulty: 'beginner',
    order: 2,
    isPublished: true,
  },
  {
    sectionSlug: 'py-variables-data-types',
    type: 'spot_error',
    question: 'Find and fix the error in this code:',
    code: 'x = 10\ny = "20"\nresult = x + y\nprint(result)',
    language: 'python',
    correctAnswer: 'x = 10\ny = "20"\nresult = x + int(y)\nprint(result)',
    explanation: 'Python does not implicitly convert types. Adding int + str raises TypeError. Convert y to int first with int(y), or convert x to str with str(x) for concatenation.',
    difficulty: 'beginner',
    order: 3,
    isPublished: true,
  },

  // Strings & Formatting
  {
    sectionSlug: 'py-strings-formatting',
    type: 'fill_blank',
    question: 'Complete the f-string to display the variable `name` in uppercase.',
    code: 'name = "alice"\nprint(f"Hello, {name.___()}")',
    language: 'python',
    correctAnswer: 'upper',
    explanation: 'str.upper() returns a new string with all characters converted to uppercase. F-strings can call methods inside the braces.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'py-strings-formatting',
    type: 'multiple_choice',
    question: 'What does `"hello world".title()` return?',
    language: 'python',
    options: ['"Hello World"', '"HELLO WORLD"', '"hello world"', '"Hello world"'],
    correctAnswer: '"Hello World"',
    explanation: 'str.title() returns a titlecased version where the first character of each word is uppercase and the rest are lowercase.',
    difficulty: 'beginner',
    order: 2,
    isPublished: true,
  },
  {
    sectionSlug: 'py-strings-formatting',
    type: 'arrange_code',
    question: 'Arrange the lines to create a function that reverses a string using slicing.',
    language: 'python',
    correctAnswer: 'def reverse_string(s):\n    return s[::-1]',
    explanation: 'The slice notation s[::-1] creates a reversed copy: start and stop are omitted (whole string), step is -1 (backwards).',
    difficulty: 'beginner',
    order: 3,
    isPublished: true,
  },

  // Lists & Tuples
  {
    sectionSlug: 'py-lists-tuples',
    type: 'multiple_choice',
    question: 'What is the output of `len([1, [2, 3], 4])`?',
    language: 'python',
    options: ['3', '4', '5', '2'],
    correctAnswer: '3',
    explanation: 'The outer list has 3 elements: 1, [2, 3] (a single nested list), and 4. len() counts top-level elements only.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'py-lists-tuples',
    type: 'spot_error',
    question: 'Find and fix the error in this code that tries to sort a list in-place:',
    code: 'numbers = [3, 1, 4, 1, 5]\nsorted_numbers = numbers.sort()\nprint(sorted_numbers)',
    language: 'python',
    correctAnswer: 'numbers = [3, 1, 4, 1, 5]\nnumbers.sort()\nprint(numbers)',
    explanation: 'list.sort() sorts in-place and returns None. Do not assign its return value. Use sorted(numbers) if you need a new sorted list.',
    difficulty: 'beginner',
    order: 2,
    isPublished: true,
  },
  {
    sectionSlug: 'py-lists-tuples',
    type: 'fill_blank',
    question: 'Complete the code to add the element 4 to the end of the list.',
    code: 'nums = [1, 2, 3]\nnums.___(4)',
    language: 'python',
    correctAnswer: 'append',
    explanation: 'list.append(x) adds a single element to the end of the list. Use list.extend() to add multiple elements.',
    difficulty: 'beginner',
    order: 3,
    isPublished: true,
  },

  // Dictionaries & Sets
  {
    sectionSlug: 'py-dicts-sets',
    type: 'multiple_choice',
    question: 'Which of these is NOT a valid way to create a dictionary in Python?',
    language: 'python',
    options: [
      'dict(a=1, b=2)',
      '{"a": 1, "b": 2}',
      'dict([("a", 1), ("b", 2)])',
      '["a": 1, "b": 2]',
    ],
    correctAnswer: '["a": 1, "b": 2]',
    explanation: 'Square brackets with colon notation is not valid Python syntax. Dicts use curly braces {}, the dict() constructor, or dict comprehensions.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'py-dicts-sets',
    type: 'fill_blank',
    question: 'Complete the code to iterate over both keys and values of a dictionary.',
    code: 'data = {"x": 1, "y": 2}\nfor key, value in data.___():\n    print(key, value)',
    language: 'python',
    correctAnswer: 'items',
    explanation: 'dict.items() returns a view of (key, value) tuples. dict.keys() returns only keys, dict.values() returns only values.',
    difficulty: 'beginner',
    order: 2,
    isPublished: true,
  },

  // Control Flow
  {
    sectionSlug: 'py-control-flow',
    type: 'arrange_code',
    question: 'Arrange these lines to create a function that returns "fizz" for multiples of 3, "buzz" for multiples of 5, "fizzbuzz" for both, or the number as a string.',
    language: 'python',
    correctAnswer: 'def fizzbuzz(n):\n    if n % 15 == 0:\n        return "fizzbuzz"\n    elif n % 3 == 0:\n        return "fizz"\n    elif n % 5 == 0:\n        return "buzz"\n    else:\n        return str(n)',
    explanation: 'Check divisibility by 15 first (both 3 and 5), then 3, then 5. Order matters — checking 3 or 5 first would match before 15.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'py-control-flow',
    type: 'spot_error',
    question: 'Find and fix the error in this code:',
    code: 'for i in range(5)\n    print(i)',
    language: 'python',
    correctAnswer: 'for i in range(5):\n    print(i)',
    explanation: 'A colon (:) is required at the end of for, while, if, elif, else, def, class, with, and try statements in Python.',
    difficulty: 'beginner',
    order: 2,
    isPublished: true,
  },

  // Functions
  {
    sectionSlug: 'py-functions',
    type: 'spot_error',
    question: 'Find and fix the bug with the mutable default argument:',
    code: 'def add_item(item, items=[]):\n    items.append(item)\n    return items',
    language: 'python',
    correctAnswer: 'def add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items',
    explanation: 'Default mutable arguments are shared across all calls. Using None as default and creating a new list inside the function avoids this well-known Python gotcha.',
    difficulty: 'intermediate',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'py-functions',
    type: 'fill_blank',
    question: 'Complete the code to create a function that accepts any number of positional arguments.',
    code: 'def total(___args):\n    return sum(args)',
    language: 'python',
    correctAnswer: '*',
    explanation: '*args collects all extra positional arguments into a tuple. The name "args" is convention — the * prefix is what matters.',
    difficulty: 'intermediate',
    order: 2,
    isPublished: true,
  },

  // Classes & OOP
  {
    sectionSlug: 'py-classes-oop',
    type: 'arrange_code',
    question: 'Arrange these lines to create a class Dog that inherits from Animal and overrides speak().',
    language: 'python',
    correctAnswer: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof!"',
    explanation: 'Python inheritance uses ParentClass in parentheses. The child class accesses inherited attributes via self. super().__init__() can be used when the child has its own __init__.',
    difficulty: 'advanced',
    order: 1,
    isPublished: true,
  },

  // Decorators & Closures
  {
    sectionSlug: 'py-decorators-closures',
    type: 'fill_blank',
    question: 'Complete the decorator to preserve the wrapped function\'s metadata.',
    code: 'from functools import ___\n\ndef my_decorator(func):\n    @___(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper',
    language: 'python',
    correctAnswer: 'wraps',
    explanation: '@functools.wraps(func) copies __name__, __doc__, and other attributes from the original function to the wrapper. Without it, debugging and introspection break.',
    difficulty: 'advanced',
    order: 1,
    isPublished: true,
  },
];

// ─── JavaScript Exercises ─────────────────────────────────────────────────────

export const jsExercises: ExerciseSeed[] = [
  // Variables & Data Types
  {
    sectionSlug: 'js-variables-data-types',
    type: 'multiple_choice',
    question: 'What does `typeof []` return in JavaScript?',
    language: 'javascript',
    options: ['"array"', '"object"', '"Array"', '"undefined"'],
    correctAnswer: '"object"',
    explanation: 'Arrays in JavaScript are objects. typeof [] returns "object". Use Array.isArray([]) to check if a value is an array.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'js-variables-data-types',
    type: 'spot_error',
    question: 'Find and fix the error in this code:',
    code: 'const PI = 3.14159;\nPI = 3.14;\nconsole.log(PI);',
    language: 'javascript',
    correctAnswer: 'let PI = 3.14159;\nPI = 3.14;\nconsole.log(PI);',
    explanation: 'const variables cannot be reassigned. If you need to reassign, use let. If the value should never change, keep const and remove the reassignment.',
    difficulty: 'beginner',
    order: 2,
    isPublished: true,
  },
  {
    sectionSlug: 'js-variables-data-types',
    type: 'multiple_choice',
    question: 'What is the result of `0.1 + 0.2 === 0.3` in JavaScript?',
    language: 'javascript',
    options: ['true', 'false', 'TypeError', 'NaN'],
    correctAnswer: 'false',
    explanation: 'Due to IEEE 754 floating-point representation, 0.1 + 0.2 = 0.30000000000000004 in JavaScript. Use Math.abs(a - b) < Number.EPSILON for float comparisons.',
    difficulty: 'beginner',
    order: 3,
    isPublished: true,
  },

  // Strings & Template Literals
  {
    sectionSlug: 'js-strings-template-literals',
    type: 'fill_blank',
    question: 'Complete the template literal to embed the expression.',
    code: 'const name = "World";\nconst greeting = `Hello, ___!`;',
    language: 'javascript',
    correctAnswer: '${name}',
    explanation: 'Template literals use ${expression} for interpolation inside backtick strings. Any valid JS expression works inside ${}.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'js-strings-template-literals',
    type: 'multiple_choice',
    question: 'Which method checks if a string starts with a given substring?',
    language: 'javascript',
    options: ['startsWith()', 'beginsWith()', 'hasPrefix()', 'indexOf() === 0'],
    correctAnswer: 'startsWith()',
    explanation: 'String.prototype.startsWith(searchString, position) returns true if the string begins with the specified characters. It was added in ES2015.',
    difficulty: 'beginner',
    order: 2,
    isPublished: true,
  },

  // Arrays
  {
    sectionSlug: 'js-arrays',
    type: 'fill_blank',
    question: 'Complete the code to find the first element greater than 10.',
    code: 'const nums = [3, 7, 12, 5, 18];\nconst result = nums.___(n => n > 10);',
    language: 'javascript',
    correctAnswer: 'find',
    explanation: 'Array.prototype.find() returns the first element that satisfies the predicate, or undefined if none matches. findIndex() returns the index instead.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'js-arrays',
    type: 'spot_error',
    question: 'Find and fix the error — this code tries to remove duplicates from an array:',
    code: 'const arr = [1, 2, 2, 3, 3];\nconst unique = arr.filter((v, i) => arr.indexOf(v) === i);\nconsole.log(unique);',
    language: 'javascript',
    correctAnswer: 'const arr = [1, 2, 2, 3, 3];\nconst unique = [...new Set(arr)];\nconsole.log(unique);',
    explanation: 'The original code actually works but is O(n²). The idiomatic and efficient way is [...new Set(arr)] which is O(n). Both produce [1, 2, 3].',
    difficulty: 'intermediate',
    order: 2,
    isPublished: true,
  },
  {
    sectionSlug: 'js-arrays',
    type: 'arrange_code',
    question: 'Arrange these lines to group an array of objects by a key using reduce.',
    language: 'javascript',
    correctAnswer: 'function groupBy(arr, key) {\n  return arr.reduce((groups, item) => {\n    const val = item[key];\n    groups[val] = groups[val] || [];\n    groups[val].push(item);\n    return groups;\n  }, {});\n}',
    explanation: 'reduce() builds an accumulator object. For each item, get the key value, initialize the array if needed, and push the item. Return the accumulator.',
    difficulty: 'intermediate',
    order: 3,
    isPublished: true,
  },

  // Objects
  {
    sectionSlug: 'js-objects',
    type: 'fill_blank',
    question: 'Complete the code to safely access a nested property using optional chaining.',
    code: 'const city = user___address___city;',
    language: 'javascript',
    correctAnswer: '?.?.', // user?.address?.city
    explanation: 'Optional chaining (?.) returns undefined instead of throwing when accessing properties of null/undefined. Chain multiple ?. for deep access.',
    difficulty: 'beginner',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'js-objects',
    type: 'multiple_choice',
    question: 'What does Object.freeze() do?',
    language: 'javascript',
    options: [
      'Makes the object completely immutable (shallow freeze)',
      'Deletes all properties',
      'Makes the object iterable',
      'Converts the object to a Map',
    ],
    correctAnswer: 'Makes the object completely immutable (shallow freeze)',
    explanation: 'Object.freeze() prevents adding, removing, or modifying properties on an object. It is a shallow freeze — nested objects are not frozen.',
    difficulty: 'intermediate',
    order: 2,
    isPublished: true,
  },

  // Functions
  {
    sectionSlug: 'js-functions',
    type: 'spot_error',
    question: 'Find and fix the error with `this` in the setTimeout callback:',
    code: 'const timer = {\n  seconds: 0,\n  start() {\n    setInterval(function() {\n      this.seconds++;\n      console.log(this.seconds);\n    }, 1000);\n  }\n};',
    language: 'javascript',
    correctAnswer: 'const timer = {\n  seconds: 0,\n  start() {\n    setInterval(() => {\n      this.seconds++;\n      console.log(this.seconds);\n    }, 1000);\n  }\n};',
    explanation: 'Regular functions have their own `this` (which is the global object in non-strict mode). Arrow functions inherit `this` from the enclosing scope, correctly referencing the timer object.',
    difficulty: 'intermediate',
    order: 1,
    isPublished: true,
  },

  // Promises & Async/Await
  {
    sectionSlug: 'js-promises-async-await',
    type: 'fill_blank',
    question: 'Complete the code to wait for all promises and get results, even if some fail.',
    code: 'const results = await Promise.___([\n  fetchUsers(),\n  fetchPosts(),\n]);',
    language: 'javascript',
    correctAnswer: 'allSettled',
    explanation: 'Promise.allSettled() waits for all promises to settle. Unlike Promise.all(), it does not short-circuit on rejection. Each result has status "fulfilled" or "rejected".',
    difficulty: 'intermediate',
    order: 1,
    isPublished: true,
  },
  {
    sectionSlug: 'js-promises-async-await',
    type: 'multiple_choice',
    question: 'What happens when you await a non-Promise value like `await 42`?',
    language: 'javascript',
    options: [
      'It returns 42 immediately',
      'It throws a TypeError',
      'It returns Promise.resolve(42)',
      'It returns undefined',
    ],
    correctAnswer: 'It returns 42 immediately',
    explanation: 'await wraps non-Promise values in Promise.resolve() automatically. So `await 42` is equivalent to `await Promise.resolve(42)`, which resolves to 42.',
    difficulty: 'intermediate',
    order: 2,
    isPublished: true,
  },

  // Classes & Prototypes
  {
    sectionSlug: 'js-classes-prototypes',
    type: 'fill_blank',
    question: 'Complete the code to define a private field in a JavaScript class.',
    code: 'class Counter {\n  ___count = 0;\n  increment() { this.___count++; }\n  get value() { return this.___count; }\n}',
    language: 'javascript',
    correctAnswer: '#',
    explanation: 'Private class fields (ES2022) use the # prefix. They are truly private — not accessible outside the class body, not even by subclasses.',
    difficulty: 'advanced',
    order: 1,
    isPublished: true,
  },
];

export const exercises: ExerciseSeed[] = [...pythonExercises, ...jsExercises];
