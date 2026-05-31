export function buildWhatsAppLink(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, '');
  const base = `https://wa.me/${clean}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildOrderWhatsAppMessage(
  tenantName: string,
  orderNumber: string,
  items: Array<{ productName: string; quantity: number; unitPrice: number }>,
  total: number,
  currency = 'BOB',
): string {
  const lines = items
    .map((i) => `  - ${i.quantity}x ${i.productName} — ${currency} ${i.unitPrice.toFixed(2)}`)
    .join('\n');
  return `Hola ${tenantName}! Me gustaría hacer el siguiente pedido #${orderNumber}:\n${lines}\n\nTotal: ${currency} ${total.toFixed(2)}`;
}

export function buildProductWhatsAppMessage(
  tenantName: string,
  productName: string,
  price: number,
  currency = 'BOB',
): string {
  return `Hola ${tenantName}! Me interesa el producto: *${productName}* — ${currency} ${price.toFixed(2)}. ¿Está disponible?`;
}
