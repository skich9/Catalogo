import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Mi Tienda Bolivia' })
  @IsString()
  @MinLength(2)
  businessName: string;

  @ApiProperty({ example: 'mi-tienda' })
  @IsString()
  @MinLength(2)
  businessSlug: string;

  @ApiProperty({ example: 'admin@mitienda.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '+59170000000' })
  @IsString()
  @IsOptional()
  phone?: string;
}
