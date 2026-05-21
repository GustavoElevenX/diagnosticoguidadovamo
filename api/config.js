export default function handler(req, res) {
  res.status(200).json({
    whatsappNumber: process.env.NEXT_PUBLIC_VERTICE_WHATSAPP_NUMBER || process.env.VERTICE_WHATSAPP_NUMBER || '',
  });
}
