import { IsString, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CartMode } from '@prisma/client';

export class UpdateTenantDto {
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() address?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() website?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() whatsappNumber?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() whatsappMessage?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() facebookPageUrl?: string;

  @ApiPropertyOptional({ enum: CartMode }) @IsEnum(CartMode) @IsOptional() cartMode?: CartMode;
  @ApiPropertyOptional() @IsString() @IsOptional() paymentInstructions?: string;

  @ApiPropertyOptional({ example: '#059669' })
  @IsString() @IsOptional()
  @Matches(/^#([0-9A-Fa-f]{6})$/, { message: 'primaryColor debe ser un color hex válido' })
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#0f172a' })
  @IsString() @IsOptional()
  @Matches(/^#([0-9A-Fa-f]{6})$/, { message: 'secondaryColor debe ser un color hex válido' })
  secondaryColor?: string;
}
