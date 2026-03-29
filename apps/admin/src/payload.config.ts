import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Validate required environment variables
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export default buildConfig({
  cors: [
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3000',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003',
    'http://127.0.0.1:3000',
  ],
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    routes: {
      admin: '/',
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
  ],
  globals: [],
  endpoints: [],
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
