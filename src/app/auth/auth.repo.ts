import { PrismaService } from '@/service/prisma-service';
import { Injectable } from '@nestjs/common';
import { AuthLogsDto } from './auth.dto';
import { generateId } from '@/lib/utils';

@Injectable()
export class AuthLogsRepo {
  constructor(private readonly prisma: PrismaService) {}
  async store(data: AuthLogsDto) {
    return this.prisma.auth_logs.create({
      data: {
        id: generateId(),
        ...data,
      },
    });
  }
}
