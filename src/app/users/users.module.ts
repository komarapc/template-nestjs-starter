import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '@/service/prisma-service';
import { UserRepo } from './users.repo';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserRepo],
})
export class UsersModule {}
