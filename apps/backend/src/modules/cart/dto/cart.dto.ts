import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty() @IsString() productId: string;
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) quantity: number;
}

export class CheckoutDto {
  @ApiPropertyOptional() @IsString() @IsOptional() customerName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() customerPhone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() customerEmail?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}
