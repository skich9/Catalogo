import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      select: {
        id: true, name: true, slug: true, email: true,
        phone: true, logoUrl: true, description: true,
        address: true, website: true,
        facebookPageUrl: true, whatsappNumber: true, whatsappMessage: true,
        cartMode: true, paymentInstructions: true, paymentQrUrl: true,
        primaryColor: true, secondaryColor: true,
        subscription: { select: { plan: true, status: true, maxProducts: true, maxEmployees: true } },
      },
    });
    if (!tenant) throw new NotFoundException('Negocio no encontrado');
    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.findOne(id);
    return this.prisma.tenant.update({
      where: { id },
      data: dto,
      select: {
        id: true, name: true, slug: true,
        phone: true, description: true, address: true, website: true,
        facebookPageUrl: true, whatsappNumber: true, whatsappMessage: true,
        cartMode: true, paymentInstructions: true,
        primaryColor: true, secondaryColor: true,
      },
    });
  }
}
