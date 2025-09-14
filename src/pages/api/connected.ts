import type { NextApiRequest, NextApiResponse } from "next"
import { NchanPub } from "../../nchan/nchanpub"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Eğer ortam geliştirme ortamı ise, hata veren post işlemini atla
  // ve doğrudan başarılı yanıtı dön.
  if (process.env.NODE_ENV === 'development') {
    res.status(200).json({ message: "Skipped in dev" });
    return;
  }

  // --- Üretim ortamında çalışacak orijinal kod ---
  const publisher = new NchanPub("lobby")
  try {
    const result = await publisher.post(req.body)
    res.status(200).json(result)
  } catch (e) {
    res.status(500).json({ error: e })
  }
}