import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/catalogo_saas';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  // Plan configs
  const plans = [
    { plan: 'FREE' as const, maxProducts: 10, maxEmployees: 1, maxImages: 3, monthlyPrice: 0, features: { analytics: false, customDomain: false } },
    { plan: 'STARTER' as const, maxProducts: 100, maxEmployees: 3, maxImages: 10, monthlyPrice: 19, features: { analytics: false, customDomain: false } },
    { plan: 'PROFESSIONAL' as const, maxProducts: 500, maxEmployees: 10, maxImages: 20, monthlyPrice: 49, features: { analytics: true, customDomain: true } },
    { plan: 'ENTERPRISE' as const, maxProducts: 99999, maxEmployees: 99999, maxImages: 50, monthlyPrice: 99, features: { analytics: true, customDomain: true } },
  ];

  for (const plan of plans) {
    await prisma.planConfig.upsert({
      where: { plan: plan.plan },
      update: plan,
      create: plan,
    });
  }

  // SuperAdmin tenant
  const superTenant = await prisma.tenant.upsert({
    where: { slug: 'superadmin' },
    update: {},
    create: {
      name: 'Plataforma Admin',
      slug: 'superadmin',
      email: 'superadmin@catalogo.bo',
      isActive: true,
    },
  });

  const superHash = await bcrypt.hash('Admin1234!', 12);
  await prisma.user.upsert({
    where: { email: 'superadmin@catalogo.bo' },
    update: {},
    create: {
      email: 'superadmin@catalogo.bo',
      passwordHash: superHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      tenantId: superTenant.id,
    },
  });

  await prisma.subscription.upsert({
    where: { tenantId: superTenant.id },
    update: {},
    create: {
      tenantId: superTenant.id,
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      maxProducts: 99999,
      maxEmployees: 99999,
    },
  });

  // Demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo-tienda' },
    update: {},
    create: {
      name: 'Tienda Demo Bolivia',
      slug: 'demo-tienda',
      email: 'demo@catalogo.bo',
      whatsappNumber: '59170000000',
      whatsappMessage: 'Hola! Quiero hacer un pedido',
      description: 'Catálogo de demostración — productos variados al mejor precio',
      cartMode: 'QR_PAYMENT',
      paymentInstructions: 'Escaneá el QR con cualquier app bancaria boliviana y pagá el monto exacto.',
    },
  });

  const demoHash = await bcrypt.hash('Demo1234!', 12);
  await prisma.user.upsert({
    where: { email: 'demo@catalogo.bo' },
    update: {},
    create: {
      email: 'demo@catalogo.bo',
      passwordHash: demoHash,
      firstName: 'Demo',
      lastName: 'Admin',
      role: 'ADMIN',
      tenantId: demoTenant.id,
    },
  });

  await prisma.subscription.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      plan: 'STARTER',
      status: 'ACTIVE',
      maxProducts: 100,
      maxEmployees: 3,
    },
  });

  // Demo categories
  const cat1 = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'electronicos', tenantId: demoTenant.id } },
    update: {},
    create: { name: 'Electrónicos', slug: 'electronicos', tenantId: demoTenant.id },
  });

  const cat2 = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'ropa', tenantId: demoTenant.id } },
    update: {},
    create: { name: 'Ropa y Accesorios', slug: 'ropa', tenantId: demoTenant.id },
  });

  // Demo products
  const demoProducts = [
    { name: 'Auriculares Bluetooth', slug: 'auriculares-bt', price: 250, categoryId: cat1.id, isFeatured: true, specs: [{ key: 'Conectividad', value: 'Bluetooth 5.0' }, { key: 'Batería', value: '20 horas' }] },
    { name: 'Cargador Rápido 20W', slug: 'cargador-rapido', price: 80, categoryId: cat1.id, specs: [{ key: 'Potencia', value: '20W' }, { key: 'Puerto', value: 'USB-C' }] },
    { name: 'Camiseta Casual', slug: 'camiseta-casual', price: 120, categoryId: cat2.id, specs: [{ key: 'Material', value: 'Algodón 100%' }, { key: 'Tallas', value: 'S, M, L, XL' }] },
    { name: 'Mochila Escolar', slug: 'mochila-escolar', price: 350, comparePrice: 420, categoryId: cat2.id, isFeatured: true, specs: [{ key: 'Capacidad', value: '25 litros' }, { key: 'Material', value: 'Poliéster reforzado' }] },
  ];

  for (const p of demoProducts) {
    const { specs, ...productData } = p;
    await prisma.product.upsert({
      where: { slug_tenantId: { slug: p.slug, tenantId: demoTenant.id } },
      update: {},
      create: {
        ...productData,
        currency: 'BOB',
        status: 'ACTIVE',
        tenantId: demoTenant.id,
        specs: { createMany: { data: specs.map((s, i) => ({ ...s, sortOrder: i })) } },
      },
    });
  }

  console.log('✅ Seed completado!');
  console.log('');
  console.log('👑 SuperAdmin: superadmin@catalogo.bo / Admin1234!');
  console.log('🏪 Demo Admin: demo@catalogo.bo / Demo1234!');
  console.log('📦 Catálogo demo: /catalog/demo-tienda');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
