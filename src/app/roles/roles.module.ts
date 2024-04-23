import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from '@/service/prisma-service';
import { RolesRepo } from './roles.repo';
import { CacheModule } from '@nestjs/cache-manager';
import { BearerService } from '@/service/bearer.service';
import { TokenService } from '@/service/token.service';
import { BearerMiddleware } from '@/middleware/bearer.middleware';

@Module({
  imports: [CacheModule.register()],
  controllers: [RolesController],
  providers: [
    RolesService,
    BearerService,
    TokenService,
    PrismaService,
    RolesRepo,
  ],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BearerMiddleware).forRoutes(RolesController);
  }
}
