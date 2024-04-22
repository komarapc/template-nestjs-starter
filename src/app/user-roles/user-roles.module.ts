import { Module } from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from '@/service/prisma-service';
import { UserRolesRepo } from './user-roles.repo';

@Module({
  imports: [CacheModule.register()],
  controllers: [UserRolesController],
  providers: [UserRolesService, PrismaService, UserRolesRepo],
})
export class UserRolesModule {}
