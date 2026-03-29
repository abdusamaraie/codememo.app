import type { CollectionConfig, Option } from 'payload';
import { syncToConvex } from '../endpoints';

const LANGUAGE_SLUG_OPTIONS = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Rust', value: 'rust' },
  { label: 'Go', value: 'go' },
  { label: 'SQL', value: 'sql' },
  { label: 'SQL2', value: 'sql2' },
  { label: 'JCR-SQL2', value: 'jcr-sql2' },
  { label: 'Bash', value: 'bash' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
] satisfies Option[];

export const Languages: CollectionConfig = {
  slug: 'languages',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'slug', 'order', 'isPublished'],
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Auto-generate slug from name on create if not provided
        if (operation === 'create' && data && !data.slug && data.name) {
          const rawName = data.name as string;
          data.slug = rawName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc }) => {
        await syncToConvex('language', doc);
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'select',
      required: true,
      options: LANGUAGE_SLUG_OPTIONS,
      admin: {
        description: 'Language identifier — set on creation and read-only thereafter.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      admin: {
        description: 'Hex color code, e.g. #3776AB',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Controls display ordering (ascending).',
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
