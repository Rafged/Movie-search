import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, title, poster, rating } = req.body;
    const response = await fetch(`/api/rated/${id}`);
    const existing = response.ok ? await response.json() : null;

    if (existing && existing.id) {
      // Обновляем рейтинг
      await fetch(`/api/rated/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, poster, rating })
      });
    } else {
      // Добавляем новый фильм
      await fetch(`/api/rated`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, poster, rating })
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: String(err) });
  }
}