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
