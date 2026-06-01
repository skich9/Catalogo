import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.categoriesService.findAll(tenantId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@CurrentUser('tenantId') tenantId: string, @Body('name') name: string) {
    return this.categoriesService.create(tenantId, name);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @Body('name') name: string,
  ) {
    return this.categoriesService.update(id, tenantId, name);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.categoriesService.remove(id, tenantId);
  }
}
