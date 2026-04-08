import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CheatSheetEntries, Exercises, Flashcards, Languages, Sections } from './collections'
import { seedDataHandler, syncConvexHandler } from './endpoints'
import { SiteSettings } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Validate required environment variables
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const PRODUCTION_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : [];

const DEV_ORIGINS =
  process.env.NODE_ENV !== 'production'
    ? [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3002',
        'http://127.0.0.1:3003',
      ]
    : [];

export default buildConfig({
  cors: [...DEV_ORIGINS, ...PRODUCTION_ORIGINS],
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    components: {
      views: {
        seedDataManager: {
          Component: '/src/components/SeedDataManager/index#default',
          path: '/seed-data-manager',
          meta: {
            title: 'Seed Data Manager',
          },
        },
      },
    },
  },
  routes: {
    admin: '/',
    api: '/api',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
    Languages,
    Sections,
    Flashcards,
    Exercises,
    CheatSheetEntries,
  ],
  globals: [SiteSettings],
  endpoints: [
    {
      path: '/seed-data',
      method: 'post',
      handler: seedDataHandler,
    },
    {
      path: '/sync-to-convex',
      method: 'post',
      handler: syncConvexHandler,
    },
  ],
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  editor: lexicalEditor({}),
})
