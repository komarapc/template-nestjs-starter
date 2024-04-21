import { PrismaService } from '@/service/prisma-service';
import { Injectable } from '@nestjs/common';
import { UserQueryDto, UserType } from './users.dto';
import { generateId } from '@/lib/utils';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}
  private selectFields = {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  };
  async findMany(query?: UserQueryDto) {
    const { email = '', name = '', page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const [allQuery, result] = await Promise.all([
      this.prisma.users.findMany({
        where: {
          deletedAt: null,
          email: { contains: email },
          name: { contains: name },
        },
      }),
      this.prisma.users.findMany({
        where: {
          deletedAt: null,
          email: { contains: email },
          name: { contains: name },
        },
        select: this.selectFields,
        skip: offset,
        take: Number(limit),
      }),
    ]);
    return { totalData: allQuery.length, users: result };
  }

  async findById(id: string) {
    return await this.prisma.users.findUnique({
      where: { id },
      select: { ...this.selectFields, user_roles: true },
    });
  }
  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }
  async create(data: UserType) {
    return await this.prisma.users.create({
      data: {
        id: generateId(),
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }
  async update(id: string, data: UserType) {
    return await this.prisma.users.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }
  async delete(id: string) {
    return await this.prisma.users.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
