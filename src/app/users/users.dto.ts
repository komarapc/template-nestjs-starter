import { generateId } from '@/lib/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserStoreProps = {
  name: string;
  email: string;
  password: string;
  roleId: string;
};

export class UserQueryDto {
  @ApiProperty({
    example: 'John Doe',
    description: "User's name",
    required: false,
  })
  name: string;
  @ApiProperty({
    example: 'johndoe@mail.com',
    description: "User's email",
    required: false,
  })
  email: string;
  @ApiProperty({ example: 1, description: 'Page number', default: 1 })
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @ApiProperty({ example: 10, description: 'Limit per page', default: 10 })
  limit?: number;
}

export class UserStoreDto {
  userId: string;
  @ApiProperty({
    example: 'John Doe',
    description: "User's name",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'johndoe@mail.com',
    description: "User's email",
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: "User's password",
    required: true,
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'role_id',
    description: "User's role id",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class UserUpdateDto {
  id: string;
  @ApiProperty({
    example: 'John Doe',
    description: "User's name",
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'johndoe@mail.com',
    description: "User's email",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: "User's password",
    required: false,
  })
  @IsOptional()
  @MinLength(8)
  password: string;
}
class UserDelete {
  @ApiProperty({
    example: generateId(),
    description: 'User id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
export class UserDeleteManyDto {
  @ApiProperty({
    example: [{ userId: generateId() }],
    description: 'List of user id',
    required: true,
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserDelete)
  data: UserDelete[];
}
