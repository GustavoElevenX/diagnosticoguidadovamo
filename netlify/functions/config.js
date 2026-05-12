export const handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    whatsappNumber: process.env.NEXT_PUBLIC_VAMO_WHATSAPP_NUMBER || process.env.VAMO_WHATSAPP_NUMBER || '',
  }),
});
