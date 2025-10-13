import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const LOCAL_RATINGS = path.join(process.cwd(), 'data', 'ratings.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    let id = body.id || body.movie_id;
    let rating = body.rating || body.value;
    let title = body.title;
    let poster = body.poster;
    const guest_session_id = body.guest_session_id || body.guestSessionId;

    // Validate rating
    if (rating !== undefined) {
      rating = Number(rating);
      if (isNaN(rating) || rating < 0.5 || rating > 10) {
        return res.status(400).json({ message: 'Rating must be a number between 0.5 and 10' });
      }
    }

    const apiKey = process.env.TMDB_API_KEY;

    if (id && apiKey) {
      // Use TMDB rating endpoint
      const tmdbUrl = new URL(`https://api.themoviedb.org/3/movie/${id}/rating`);
      tmdbUrl.searchParams.set('api_key', apiKey);
      if (guest_session_id) tmdbUrl.searchParams.set('guest_session_id', guest_session_id);

      const r = await fetch(tmdbUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ value: rating })
      });

      const data = await r.json();
      // TMDB returns {status_code, status_message} on success
      if (!r.ok && data && data.status_code) {
        return res.status(r.status).json({ message: data.status_message || 'TMDB error', data });
      }

      return res.status(200).json({ success: true, source: 'tmdb', data });
    }

    // Fallback: store locally in data/ratings.json (for manual entries or when TMDB key missing)
    const payload = { id, title, poster, rating, created_at: new Date().toISOString() };
    let existing = [];
    try {
      existing = JSON.parse(fs.readFileSync(LOCAL_RATINGS, 'utf-8') || '[]');
    } catch {
      existing = [];
    }
    // if id present try update, else push new with generated id
    if (id) {
      const idx = existing.findIndex((r: any) => String(r.id) === String(id));
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...payload };
      } else {
        existing.push(payload);
      }
    } else {
      // generate id
      // @ts-ignore
      payload.id = Date.now();
      existing.push(payload);
    }
    fs.writeFileSync(LOCAL_RATINGS, JSON.stringify(existing, null, 2), 'utf-8');
    return res.status(200).json({ success: true, source: 'local', results: payload });
  } catch (err:any) {
    res.status(500).json({ message: 'Server error', error: String(err?.message || err) });
  }
}
