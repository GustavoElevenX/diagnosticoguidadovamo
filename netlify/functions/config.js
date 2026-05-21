export const handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    whatsappNumber: process.env.NEXT_PUBLIC_VERTICE_WHATSAPP_NUMBER || process.env.VERTICE_WHATSAPP_NUMBER || '',
  }),
});
