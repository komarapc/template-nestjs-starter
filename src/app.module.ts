import { PrismaService } from './service/prisma-service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@/middleware/throtle-guard';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './app/users/users.module';
import { UserRolesModule } from './app/user-roles/user-roles.module';
import { RolesModule } from './app/roles/roles.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path, { join } from 'path';
import { ModelsModule } from './app/models/models.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    CacheModule.register(),
    UsersModule,
    UserRolesModule,
    RolesModule,
    ModelsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_GUARD', useClass: ThrottlerGuard },
    PrismaService,
  ],
})
export class AppModule {}
