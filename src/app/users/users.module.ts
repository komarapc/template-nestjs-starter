import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '@/service/prisma-service';
import { UserRepo } from './users.repo';
import { CacheModule } from '@nestjs/cache-manager';
import { UserRolesRepo } from '../user-roles/user-roles.repo';
import { RolesRepo } from '../roles/roles.repo';
import { BearerMiddleware } from '@/middleware/bearer.middleware';
import { BearerService } from '@/service/bearer.service';
import { TokenService } from '@/service/token.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [UsersController],
  providers: [
    UsersService,
    BearerService,
    TokenService,
    PrismaService,
    UserRepo,
    UserRolesRepo,
    RolesRepo,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BearerMiddleware).forRoutes(UsersController);
  }
}
