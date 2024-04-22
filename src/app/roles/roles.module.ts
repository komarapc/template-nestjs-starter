import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from '@/service/prisma-service';
import { RolesRepo } from './roles.repo';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [RolesController],
  providers: [RolesService, PrismaService, RolesRepo],
})
export class RolesModule {}
