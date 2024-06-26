import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'Email',
    required: true,
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    required: true,
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Remember me',
    required: false,
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  rememberMe: boolean;
}

export class AuthWithRoleDto {
  @ApiProperty({
    description: 'Role ID',
    required: true,
    example: 'role-id',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
export class AuthLogsDto {
  userId: string;
  action: string;
}
