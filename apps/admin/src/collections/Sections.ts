import type { CollectionConfig, Option } from 'payload';
import { syncToConvex } from '../endpoints';

const DIFFICULTY_OPTIONS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
] satisfies Option[];

export const Sections: CollectionConfig = {
  slug: 'sections',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'language', 'difficulty', 'order', 'isPublished'],
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Auto-generate slug from title on create if not provided
        if (operation === 'create' && data && !data.slug && data.title) {
          const rawTitle = data.title as string;
          data.slug = rawTitle
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc }) => {
        await syncToConvex('sections', doc);
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await syncToConvex('sections', doc, 'delete');
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier. Auto-generated from title on creation.',
        readOnly: true,
      },
    },
    {
      name: 'language',
      type: 'relationship',
      relationTo: 'languages',
      required: true,
      admin: {
        description: 'The programming language this section belongs to.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Controls display ordering within the language (ascending).',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: DIFFICULTY_OPTIONS,
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      label: 'Published',
    },
  ],
};
