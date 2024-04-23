import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '@/service/prisma-service';
import { UserRepo } from '../users/users.repo';
import { UserRolesRepo } from '../user-roles/user-roles.repo';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserRepo, UserRolesRepo],
})
export class AuthModule {}
