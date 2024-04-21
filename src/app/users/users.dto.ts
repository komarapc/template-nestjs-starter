import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserQueryDto {
  @ApiProperty({ example: 'John Doe', description: "User's name" })
  name: string;
  @ApiProperty({ example: 'johndoe@mail.com', description: "User's email" })
  email: string;
  @ApiProperty({ example: 1, description: 'Page number', default: 1 })
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @ApiProperty({ example: 10, description: 'Limit per page', default: 10 })
  limit?: number;
}
