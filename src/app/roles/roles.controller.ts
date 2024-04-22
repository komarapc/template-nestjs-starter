import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleCreateDto, RoleQueryDto } from './roles.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '@/lib/utils';

@ApiTags('roles')
@ApiCommonResponses()
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}
  @Get()
  async findMany(@Query() query: RoleQueryDto, @Res() res: Response) {
    const result = await this.roleService.findManyWithCaching(query);
    res.status(result.statusCode).send(result);
  }
  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.roleService.findByIdWithCaching(id);
    res.status(result.statusCode).send(result);
  }

  @Post()
  async store(@Body() Body: RoleCreateDto, @Res() res: Response) {}
}
