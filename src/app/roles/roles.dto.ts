import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoleQueryDto {
  @ApiProperty({
    example: 'Admin',
    description: 'The name of the role',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'The page number',
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    example: 10,
    description: 'The number of items per page',
    type: Number,
  })
  @IsOptional()
  limit: number;
}

export class RoleCreateDto {
  id: string;
  @ApiProperty({
    example: 'Admin',
    description: 'The name of the role',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
