import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const LOCAL_RATINGS = path.join(process.cwd(), 'data', 'ratings.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const guest_session_id = req.query.guest_session_id || req.query.guestSessionId || req.headers['x-guest-session-id'];

    if (apiKey && guest_session_id) {
      // Fetch rated movies for guest session from TMDB
      const tmdbUrl = new URL(`https://api.themoviedb.org/3/guest_session/${guest_session_id}/rated/movies`);
      tmdbUrl.searchParams.set('api_key', apiKey);
      tmdbUrl.searchParams.set('language', 'en-US');
      tmdbUrl.searchParams.set('page', String(req.query.page || 1));

      const r = await fetch(tmdbUrl.toString());
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ message: data.status_message || 'TMDB error', data });
      }
      return res.status(200).json(data);
    }

    // Fallback: return locally stored ratings
    let existing = [];
    try {
      existing = JSON.parse(fs.readFileSync(LOCAL_RATINGS, 'utf-8') || '[]');
    } catch {
      existing = [];
    }
    // Normalize to { results: [...] } for compatibility
    return res.status(200).json({ results: existing });
  } catch (err:any) {
    res.status(500).json({ message: 'Server error', error: String(err?.message || err) });
  }
}
