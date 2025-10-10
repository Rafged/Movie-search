import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'id required' });
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server TMDB_API_KEY not configured' });
    const url = `https://api.themoviedb.org/3/movie/${encodeURIComponent(String(id))}?api_key=${apiKey}&language=en-US`;
    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      return res.status(r.status).json({ error: txt });
    }
    const data = await r.json();
    return res.status(200).json(data);
  } catch (err:any) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
