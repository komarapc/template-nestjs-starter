import { PrismaService } from '@/service/prisma-service';
import { Injectable } from '@nestjs/common';
import { UserRolesQuery, UserRolesStoreDto } from './user-roles.dto';
import { generateId } from '@/lib/utils';

@Injectable()
export class UserRolesRepo {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(query: UserRolesQuery) {
    const { limit = 10, page = 1 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [queryData, queryResult] = await Promise.all([
      this.prisma.user_roles.count({
        where: {
          deletedAt: null,
          userId: { contains: query.userId },
          roles: { name: { contains: query.roleName } },
        },
      }),
      this.prisma.user_roles.findMany({
        where: {
          deletedAt: null,
          userId: { contains: query.userId },
          roles: { name: { contains: query.roleName } },
        },
        skip,
        take: Number(limit),
        include: {
          roles: {
            select: {
              name: true,
            },
          },
          users: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);
    return { totalData: queryData, userRoles: queryResult };
  }

  async findById(id: string) {
    return this.prisma.user_roles.findUnique({
      where: { id },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        users: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }
  async findByUserId(userId: string) {
    return this.prisma.user_roles.findMany({
      where: { deletedAt: null, userId },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async store(data: UserRolesStoreDto) {
    const { id, roles, users } = await this.prisma.user_roles.create({
      data: { id: generateId(), ...data },
      select: {
        id: true,
        roles: { select: { id: true, name: true } },
        users: { select: { id: true, name: true, email: true } },
      },
    });
    return { id, roles, users };
  }
  async findByUserIdAndRoleId(userId: string, roleId: string) {
    return this.prisma.user_roles.findFirst({
      where: {
        userId,
        roleId,
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async update(data: UserRolesStoreDto) {
    return this.prisma.user_roles.update({
      where: { id: data.id },
      data,
      select: {
        id: true,
        roles: { select: { id: true, name: true } },
        users: { select: { id: true, name: true, email: true } },
      },
    });
  }
  async delete(id: string) {
    return this.prisma.user_roles.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
