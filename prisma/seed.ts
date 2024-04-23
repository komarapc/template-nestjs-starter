import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const alphabets =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const roles = Array.from(
  new Set(Array.from({ length: 10 }, () => faker.person.jobType())),
);
async function main() {
  const users = Array.from({ length: 100 }, () => ({
    id: customAlphabet(alphabets, 21)(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync('password', Number(process.env.SALT_ROUND) || 10),
  }));

  for (const user of users) {
    await prisma.users.create({ data: user });
  }
  console.log('Users seeded successfully');

  const roles = Array.from(
    new Set([
      ...Array.from({ length: 10 }, () => faker.person.jobType()),
      'Administrator',
      'Guest',
    ]),
  ).map((role) => ({
    id: customAlphabet(alphabets, 21)(),
    name: role,
  }));
  for (const role of roles) {
    await prisma.roles.create({ data: role });
  }

  const userRoles = users.map((user) => ({
    id: customAlphabet(alphabets, 21)(),
    userId: user.id,
    roleId: roles[Math.floor(Math.random() * roles.length)].id,
  }));

  for (const userRole of userRoles) {
    await prisma.user_roles.create({ data: userRole });
  }

  console.log('Roles seeded successfully');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
