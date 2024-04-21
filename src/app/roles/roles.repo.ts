import { PrismaService } from '@/service/prisma-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepo {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string) {
    return this.prisma.roles.findUnique({ where: { id } });
  }
}
