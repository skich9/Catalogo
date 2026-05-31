import {
  IsString, IsNumber, IsOptional, IsBoolean, IsArray,
  MinLength, Min, IsEnum, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class ProductSpecDto {
  @IsString() key: string;
  @IsString() value: string;
  @IsOptional() @IsNumber() sortOrder?: number;
}

export class CreateProductDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;

  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;

  @ApiProperty({ example: 150.0 }) @IsNumber() @Min(0) price: number;

  @ApiPropertyOptional({ example: 200.0 }) @IsNumber() @Min(0) @IsOptional() comparePrice?: number;

  @ApiPropertyOptional({ default: 'BOB' }) @IsString() @IsOptional() currency?: string;

  @ApiPropertyOptional({ enum: ProductStatus }) @IsEnum(ProductStatus) @IsOptional() status?: ProductStatus;

  @ApiPropertyOptional() @IsBoolean() @IsOptional() isFeatured?: boolean;

  @ApiPropertyOptional() @IsString() @IsOptional() categoryId?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() whatsappNumber?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() whatsappMessage?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() facebookUrl?: string;

  @ApiPropertyOptional({ type: [ProductSpecDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => ProductSpecDto) @IsOptional()
  specs?: ProductSpecDto[];
}
