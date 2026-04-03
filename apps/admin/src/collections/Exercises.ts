import type { CollectionConfig, Option } from 'payload';
import { syncToConvex } from '../endpoints';

const DIFFICULTY_OPTIONS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
] satisfies Option[];

const EXERCISE_TYPE_OPTIONS = [
  { label: 'Fill in the Blank', value: 'fill_blank' },
  { label: 'Multiple Choice',   value: 'multiple_choice' },
  { label: 'Arrange Lines',     value: 'arrange_code' },
  { label: 'Spot the Error',    value: 'spot_error' },
] satisfies Option[];

export const Exercises: CollectionConfig = {
  slug: 'exercises',
  access: { read: () => true },
  admin: {
    useAsTitle: 'question',
    group: 'Content',
    defaultColumns: ['section', 'type', 'difficulty', 'order', 'isPublished'],
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        await syncToConvex('exercises', doc);
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await syncToConvex('exercises', doc, 'delete');
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
      name: 'type',
      type: 'select',
      required: true,
      options: EXERCISE_TYPE_OPTIONS,
      label: 'Exercise Type',
    },
    {
      name: 'question',
      type: 'textarea',
      required: true,
    },
    {
      name: 'code',
      type: 'textarea',
      label: 'Code Snippet',
      admin: {
        description: 'Optional code block shown alongside the question.',
      },
    },
    {
      name: 'language',
      type: 'text',
      label: 'Code Language',
      admin: {
        description: 'Language hint for syntax highlighting (e.g. python, typescript).',
      },
    },
    {
      name: 'options',
      type: 'array',
      label: 'Answer Options',
      admin: {
        description: 'Provide choices for multiple-choice exercises.',
        condition: (_, siblingData) => siblingData?.type === 'multiple_choice',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Option',
        },
      ],
    },
    {
      name: 'correctAnswer',
      type: 'textarea',
      required: true,
      label: 'Correct Answer',
      admin: {
        description:
          'For multiple-choice use the option text. For arrange-lines, provide newline-separated lines in order.',
      },
    },
    {
      name: 'explanation',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Shown to the learner after they answer.',
      },
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
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      label: 'Published',
    },
  ],
};
