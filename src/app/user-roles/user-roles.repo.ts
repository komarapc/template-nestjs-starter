import { PrismaService } from '@/service/prisma-service';
import { Injectable } from '@nestjs/common';
import { UserRolesStoreDto } from './user-roles.dto';
import { generateId } from '@/lib/utils';

@Injectable()
export class UserRolesRepo {
  constructor(private readonly prisma: PrismaService) {}

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
