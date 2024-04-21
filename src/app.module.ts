import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from 'middleware/throtle-guard';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class AppModule {}
