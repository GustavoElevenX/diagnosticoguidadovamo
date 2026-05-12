export default function handler(req, res) {
  res.status(200).json({
    whatsappNumber: process.env.NEXT_PUBLIC_VAMO_WHATSAPP_NUMBER || process.env.VAMO_WHATSAPP_NUMBER || '',
  });
}
