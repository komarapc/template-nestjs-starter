import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from '@/service/prisma-service';
import { UserRolesRepo } from './user-roles.repo';
import { UserRepo } from '../users/users.repo';
import { RolesRepo } from '../roles/roles.repo';
import { BearerMiddleware } from '@/middleware/bearer.middleware';
import { BearerService } from '@/service/bearer.service';
import { TokenService } from '@/service/token.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [UserRolesController],
  providers: [
    UserRolesService,
    BearerService,
    TokenService,
    PrismaService,
    UserRolesRepo,
    UserRepo,
    RolesRepo,
  ],
})
export class UserRolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BearerMiddleware).forRoutes(UserRolesController);
  }
}
