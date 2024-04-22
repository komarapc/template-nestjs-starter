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

  async findById(id: string) {}

  async store(data: UserRolesStoreDto) {
    const {
      id,
      roles: { name },
    } = await this.prisma.user_roles.create({
      data: {
        id: generateId(),
        userId: data.userId,
        roleId: data.roleId,
      },
      select: {
        id: true,
        roles: { select: { name: true } },
      },
    });
    return { id, name };
  }
}
