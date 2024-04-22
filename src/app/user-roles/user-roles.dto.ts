import { ApiProperty } from '@nestjs/swagger';
import { generateId } from '@/lib/utils';
import { IsNotEmpty, IsString } from 'class-validator';
export class UserRolesStoreDto {
  @ApiProperty({ example: generateId(), description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: generateId(), description: 'Role ID' })
  @IsNotEmpty()
  @IsString()
  roleId: string;
}

export class UserRolesQuery {
  @ApiProperty({
    example: generateId(),
    description: 'User ID',
    required: false,
  })
  userId: string;
  @ApiProperty({
    example: 'Admin',
    description: 'Role name',
    required: false,
  })
  roleName: string;
  @ApiProperty({ example: 10, description: 'Limit data' })
  limit: number;

  @ApiProperty({ example: 1, description: 'Page number' })
  page: number;
}
