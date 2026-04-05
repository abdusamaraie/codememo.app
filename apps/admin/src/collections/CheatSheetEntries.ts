import type { CollectionConfig } from 'payload';
import { syncToConvex } from '../endpoints';
import { isAdmin } from '../access';

export const CheatSheetEntries: CollectionConfig = {
  slug: 'cheatSheetEntries',
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['language', 'category', 'title', 'order', 'isPublished'],
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        await syncToConvex('cheatSheetEntries', doc);
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await syncToConvex('cheatSheetEntries', doc, 'delete');
      },
    ],
  },
  fields: [
    {
      name: 'language',
      type: 'relationship',
      relationTo: 'languages',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Grouping label (e.g. "Node Types", "Path Functions", "Array Methods").',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Entry name (e.g. "ISDESCENDANTNODE", "list comprehension").',
      },
    },
    {
      name: 'syntax',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Primary code syntax or pattern to remember.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short explanation of what this syntax does.',
      },
    },
    {
      name: 'example',
      type: 'textarea',
      admin: {
        description: 'Optional example code snippet showing usage.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Controls display ordering within the category (ascending).',
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
