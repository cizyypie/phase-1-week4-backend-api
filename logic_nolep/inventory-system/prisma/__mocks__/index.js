import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const generateDatabaseURL = () => {
  if (!process.env.TEST_DB_URL) {
    throw new Error('please provide a database url')
  }
  return process.env.TEST_DB_URL
}

const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma')
const url = generateDatabaseURL()

process.env.DB_URL = url

const prisma = new PrismaClient({
  datasources: { db: { url } },
})

beforeAll(async () => {
  execSync(`${prismaBinary} db push`, {
    env: { ...process.env, TEST_DB_URL: url },
  })
})

export default prisma