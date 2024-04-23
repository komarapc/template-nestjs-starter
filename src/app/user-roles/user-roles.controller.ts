import { ApiCommonResponses } from '@/lib/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { UserRolesService } from './user-roles.service';
import { UserRolesQuery, UserRolesStoreDto } from './user-roles.dto';
import { Response } from 'express';

@ApiTags('user-roles')
@ApiCommonResponses()
@SkipThrottle({ short: true, medium: true, long: false })
@ApiBearerAuth()
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRoleService: UserRolesService) {}
  @Get()
  async findMany(@Query() query: UserRolesQuery, @Res() res: Response) {
    query.limit = Number(query.limit) || 10;
    query.page = Number(query.page) || 1;
    const result = await this.userRoleService.findManyWithCaching(query);
    res.status(result.statusCode).send(result);
  }
  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userRoleService.findByIdWithCaching(id);
    res.status(result.statusCode).send(result);
  }
  @Post()
  async store(@Body() body: UserRolesStoreDto, @Res() res: Response) {
    const result = await this.userRoleService.store(body);
    res.status(result.statusCode).send(result);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UserRolesStoreDto,
    @Res() res: Response,
  ) {
    const result = await this.userRoleService.update(id, body);
    res.status(result.statusCode).send(result);
  }
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userRoleService.delete(id);
    res.status(result.statusCode).send(result);
  }
}
