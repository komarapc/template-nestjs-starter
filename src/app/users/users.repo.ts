import { PrismaService } from '@/service/prisma-service';
import { Injectable } from '@nestjs/common';
import {
  UserQueryDto,
  UserStoreDto,
  UserType,
  UserUpdateDto,
} from './users.dto';
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
        select: {
          ...this.selectFields,
          user_roles: {
            select: { id: true, roles: { select: { name: true } } },
          },
        },
        orderBy: { name: 'asc' },
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
  async create(data: UserStoreDto) {
    return await this.prisma.users.create({
      data: {
        id: data.userId,
        name: data.name,
        email: data.email,
        password: data.password,
      },
      select: this.selectFields,
    });
  }
  async update(data: UserUpdateDto) {
    return await this.prisma.users.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      select: this.selectFields,
    });
  }
  async delete(id: string) {
    return await this.prisma.users.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
