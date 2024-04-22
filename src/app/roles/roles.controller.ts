import { Controller, Get, Query, Res } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleQueryDto } from './roles.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  async findMany(@Query() query: RoleQueryDto, @Res() res: Response) {}
}
