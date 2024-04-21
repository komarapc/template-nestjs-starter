import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const alphabets =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
async function main() {
  const users = Array.from({ length: 100 }, () => ({
    id: customAlphabet(alphabets, 21)(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(
      'passsword',
      Number(process.env.SALT_ROUND) || 10,
    ),
  }));

  for (const user of users) {
    await prisma.users.create({ data: user });
  }
  console.log('Users seeded successfully');

  const roles = Array.from({ length: 10 }, () => ({
    id: customAlphabet(alphabets, 21)(),
    name: faker.person.jobType(),
  }));
  for (const role of roles) {
    await prisma.roles.create({ data: role });
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
