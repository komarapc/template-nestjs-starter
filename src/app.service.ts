import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type Response = {
  statusCode: number;
  statusMessage: string;
  success: boolean;
  data?: any;
};
@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getHello() {
    return {
      statusCode: 200,
      statusMessage: 'OK',
      success: true,
    };
  }

  async getHelloWithCaching(): Promise<Response> {
    let data: Response = await this.cacheManager.get('root');
    if (!data) {
      data = await this.getHello();
      await this.cacheManager.set('root', data, 0);
    }
    return data;
  }
}
