import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from './users.repo';
import { UserQueryDto } from './users.dto';
import {
  debugConsole,
  ResponseData,
  responseError,
  responseSuccess,
} from '@/lib/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepo,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findManyWithCaching(query?: UserQueryDto) {
    try {
      const key = `users-${JSON.stringify(query)}`;
      query.limit = Number(query.limit) || 10;
      let users: any = await this.cacheManager.get(key);
      if (users)
        return responseSuccess({
          data: users,
          code: 200,
        });

      const { totalData, users: result } = await this.userRepo.findMany(query);
      const totalPage = Math.ceil(totalData / query.limit || 10);
      const data = {
        meta: { totalData, totalPage, limit: Number(query.limit) || 10 },
        users: result,
      };
      await this.cacheManager.set(key, data, 1000 * 10);
      return responseSuccess({ data, code: 200 });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async findByIdWithCaching(id: string) {
    try {
      if (!id) return responseError({ code: 400, message: 'id is required' });
      const key = `user-${id}`;
      let userCache: any = await this.cacheManager.get(key);
      if (userCache) return responseSuccess({ data: userCache, code: 200 });
      const user = await this.userRepo.findById(id);
      if (!user) return responseError({ code: 404, message: 'User not found' });
      await this.cacheManager.set(key, user, 1000 * 10);
      return responseSuccess({ data: user, code: 200 });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
}
