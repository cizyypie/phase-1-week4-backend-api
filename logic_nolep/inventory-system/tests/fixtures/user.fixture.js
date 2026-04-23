import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'
import prisma from '../../prisma/index.js'

export const password = 'password1'
const salt = bcrypt.genSaltSync(8)
const hashedPassword = bcrypt.hashSync(password, salt)

export const userOne = {
  id: crypto.randomUUID(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
}

export const userTwo = {
  id: crypto.randomUUID(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
}

export const admin = {
  id: crypto.randomUUID(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
}

export const insertUsers = async (users) => {
  const hashed = users.map((user) => ({ ...user, password: hashedPassword }))
  await prisma.user.createMany({ data: hashed, skipDuplicates: true })
}