import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto, AuthWithRoleDto } from './auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '@/lib/utils';
@ApiTags('auth')
@ApiCommonResponses()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signin(@Res() res: Response, @Body() body: AuthDto) {
    const result = await this.authService.signin(body);
    return res.status(result.statusCode).send(result);
  }
  @ApiBearerAuth()
  @Post('/signin/role')
  async signinRole(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AuthWithRoleDto,
  ) {
    console.log('authorization', req.headers.authorization);
    console.log({ body });
    return res.status(200).send({ message: 'Role selected successfully' });
  }
}
