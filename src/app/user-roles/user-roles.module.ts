import { Module } from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from '@/service/prisma-service';
import { UserRolesRepo } from './user-roles.repo';
import { UserRepo } from '../users/users.repo';
import { RolesRepo } from '../roles/roles.repo';

@Module({
  imports: [CacheModule.register()],
  controllers: [UserRolesController],
  providers: [
    UserRolesService,
    PrismaService,
    UserRolesRepo,
    UserRepo,
    RolesRepo,
  ],
})
export class UserRolesModule {}
