import type { CollectionConfig, Option } from 'payload';
import { syncToConvex } from '../endpoints';

const DIFFICULTY_OPTIONS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
] satisfies Option[];

const QUESTION_TYPE_OPTIONS = [
  { label: 'Fill in the Blank', value: 'fill-in-blank' },
  { label: 'Multiple Choice', value: 'multiple-choice' },
  { label: 'Code Completion', value: 'code-completion' },
  { label: 'True / False', value: 'true-false' },
] satisfies Option[];

/** Shared field group for a flashcard face (front or back). */
const faceFields = [
  {
    name: 'prompt',
    type: 'text' as const,
    required: true,
    label: 'Prompt',
    admin: {
      description: 'The question or hint shown on this face.',
    },
  },
  {
    name: 'code',
    type: 'textarea' as const,
    label: 'Code Snippet',
    admin: {
      description: 'Optional code block displayed alongside the prompt.',
    },
  },
  {
    name: 'language',
    type: 'text' as const,
    label: 'Code Language',
    admin: {
      description: 'Language hint for syntax highlighting (e.g. python, typescript).',
    },
  },
];

export const Flashcards: CollectionConfig = {
  slug: 'flashcards',
  admin: {
    useAsTitle: 'id',
    group: 'Content',
    defaultColumns: ['section', 'questionType', 'difficulty', 'order', 'isPublished'],
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        await syncToConvex('flashcard', doc);
      },
    ],
  },
  fields: [
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      required: true,
    },
    {
      name: 'questionType',
      type: 'select',
      required: true,
      options: QUESTION_TYPE_OPTIONS,
      label: 'Question Type',
    },
    {
      name: 'front',
      type: 'group',
      label: 'Front Face',
      fields: faceFields,
    },
    {
      name: 'back',
      type: 'group',
      label: 'Back Face',
      fields: faceFields,
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: DIFFICULTY_OPTIONS,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Controls display ordering within the section (ascending).',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Tag',
        },
      ],
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      label: 'Published',
    },
  ],
};
