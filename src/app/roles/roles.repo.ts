import { PrismaService } from '@/service/prisma-service';
import { Injectable } from '@nestjs/common';
import { RoleQueryDto } from './roles.dto';

@Injectable()
export class RolesRepo {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(query: RoleQueryDto) {
    const { limit = 10, page = 1, name } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [queryData, queryResult] = await Promise.all([
      this.prisma.roles.count({
        where: {
          deletedAt: null,
          name: { contains: name },
        },
      }),
      this.prisma.roles.findMany({
        where: {
          deletedAt: null,
          name: { contains: name },
        },
        skip,
        take: Number(limit),
      }),
    ]);
    return { queryData, queryResult };
  }
  async findById(id: string) {
    return this.prisma.roles.findUnique({ where: { id } });
  }
}
