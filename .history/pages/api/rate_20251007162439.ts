import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, title, poster, rating } = req.body;
    const response = await fetch(`http://localhost:3001/ratings/${id}`);
    const existing = response.ok ? await response.json() : null;

    if (existing && existing.id) {
      // Обновляем рейтинг
      await fetch(`http://localhost:3001/ratings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, poster, rating })
      });
    } else {
      // Добавляем новый фильм
      await fetch(`http://localhost:3001/ratings`, {
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