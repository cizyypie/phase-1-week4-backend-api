import { jest } from '@jest/globals'
import { config } from 'dotenv'
import { join } from 'path'

config({ path: join(process.cwd(), '.env') })

const prismaMock = await import('./prisma/__mocks__/index.js')

jest.unstable_mockModule('./prisma/index.js', () => ({
  default: prismaMock.default,
}))

jest.setTimeout(30000)