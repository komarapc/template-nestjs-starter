import { Inject, Injectable } from '@nestjs/common';
import { RolesRepo } from './roles.repo';
import { RoleCreateDto, RoleQueryDto } from './roles.dto';
import {
  debugConsole,
  generateId,
  responseError,
  responseSuccess,
} from '@/lib/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepo: RolesRepo,
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
  ) {}

  async findMany(query: RoleQueryDto) {
    try {
      query.limit = Number(query.limit) || 10;
      query.page = Number(query.page) || 1;
      const { queryData, queryResult: roles } =
        await this.roleRepo.findMany(query);

      const totalPage = Math.ceil(queryData / query.limit);
      const meta = {
        totalData: queryData,
        totalPage,
        currentPage: query.page,
        perPage: query.limit,
      };
      return responseSuccess({ code: 200, data: { meta, roles } });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async findManyWithCaching(query: RoleQueryDto) {
    try {
      const key = `roles-${JSON.stringify(query)}`;
      const roles = await this.cacheManger.get(key);
      if (roles) {
        return responseSuccess({ code: 200, data: roles });
      }
      const result = await this.findMany(query);
      await this.cacheManger.set(key, result.data, 1000 * 30);
      return result;
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async findById(id: string) {
    try {
      const role = await this.roleRepo.findById(id);
      if (!role) return responseError({ code: 404 });
      return responseSuccess({ code: 200, data: role });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async findByIdWithCaching(id: string) {
    try {
      const key = `role-${id}`;
      const role = await this.cacheManger.get(key);
      if (role) return responseSuccess({ code: 200, data: role });
      const result = await this.findById(id);
      await this.cacheManger.set(key, result.data, 1000 * 30);
      return result;
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async store(data: RoleCreateDto) {
    try {
      data.id = generateId();
      const existRole = await this.roleRepo.findByName(data.name);
      if (existRole)
        return responseError({ code: 409, message: 'Role already exist' });
      const role = await this.roleRepo.store(data);
      return responseSuccess({ code: 201, data: role });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
  async update(id: string, data: RoleCreateDto) {
    try {
      data.id = id;
      const [existRole, existName] = await Promise.all([
        this.roleRepo.findById(data.id),
        this.roleRepo.findByName(data.name),
      ]);
      if (!existRole)
        return responseError({ code: 404, message: 'Role not found' });
      if (existName)
        return responseError({ code: 409, message: 'Role already exist' });
      const role = await this.roleRepo.update(data);
      return responseSuccess({ code: 200, data: role });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async delete(id: string) {
    try {
      const existRole = await this.roleRepo.findById(id);
      if (!existRole || existRole.deletedAt)
        return responseError({ code: 404, message: 'Role not found' });
      await this.roleRepo.delete(id);
      return responseSuccess({ code: 200, message: 'Deleted' });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
}
