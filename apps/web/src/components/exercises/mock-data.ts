import type { PracticeExercise } from './types';

export const MOCK_EXERCISES: Record<string, PracticeExercise[]> = {
  python: [
    {
      id: 'py-fill-1',
      type: 'fill_blank',
      prompt: 'Fill the missing keyword for list comprehension filtering.',
      codeTemplate: '[x**2 for x in range(10) __ x % 2 == 0]',
      correctAnswer: 'if',
      explanation: '`if` adds a filter condition inside the comprehension.',
    },
    {
      id: 'py-mc-1',
      type: 'multiple_choice',
      prompt: 'Which snippet creates a dictionary comprehension?',
      options: [
        '[k: v for k, v in pairs]',
        '{k: v for k, v in pairs}',
        '(k: v for k, v in pairs)',
      ],
      correctAnswer: '{k: v for k, v in pairs}',
      explanation: 'Dictionary comprehensions use curly braces and key:value syntax.',
    },
    {
      id: 'py-spot-1',
      type: 'spot_error',
      prompt: 'Spot the syntax error in this function definition.',
      codeTemplate: 'def greet(name)\n    return f"Hi {name}"',
      correctAnswer: 'Missing colon after function parameters',
      explanation: 'Python function definitions must end with a colon.',
    },
    {
      id: 'py-arr-1',
      type: 'arrange_code',
      prompt: 'Arrange the lines to define and call a function.',
      options: ['print(add(2, 3))', 'def add(a, b):', '    return a + b'],
      correctAnswer: ['def add(a, b):', '    return a + b', 'print(add(2, 3))'],
      explanation: 'Define function first, then call it.',
    },
  ],
  typescript: [
    {
      id: 'ts-mc-1',
      type: 'multiple_choice',
      prompt: 'Which declaration defines a generic identity function?',
      options: [
        'function identity(value) { return value }',
        'function identity<T>(value: T): T { return value }',
        'const identity = <value>(T) => T',
      ],
      correctAnswer: 'function identity<T>(value: T): T { return value }',
      explanation: 'Generic function uses type parameter `<T>` and typed argument/return.',
    },
    {
      id: 'ts-fill-1',
      type: 'fill_blank',
      prompt: 'Fill the utility type that makes all fields optional.',
      codeTemplate: 'type DraftUser = ____<User>',
      correctAnswer: 'Partial',
      explanation: '`Partial<T>` transforms every property in `T` to optional.',
    },
    {
      id: 'ts-spot-1',
      type: 'spot_error',
      prompt: 'Spot the type issue in this union handler.',
      codeTemplate: 'function area(shape: Circle | Rectangle) {\n  return shape.radius * shape.radius;\n}',
      correctAnswer: 'Missing discriminated narrowing before accessing radius',
      explanation: 'Need to narrow by a discriminant (e.g., `shape.kind`) before property access.',
    },
  ],
};

export function getMockExercises(language: string): PracticeExercise[] {
  return MOCK_EXERCISES[language] ?? MOCK_EXERCISES.python;
}

