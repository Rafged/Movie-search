import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    // Support two payload formats:
    // 1) { movie_id, value, guest_session_id } (from frontend)
    // 2) { id, title, poster, rating } (manual)
    let id = body.id || body.movie_id;
    let rating = body.rating || body.value;
    let title = body.title;
    let poster = body.poster;

    // If only movie_id and value were sent, fetch movie details from TMDB to populate title/poster
    if ((id && rating) && (!title || !poster)) {
      const key = process.env.TMDB_API_KEY;
      if (key) {
        try {
          const r = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}`);
          if (r.ok) {
            const movie = await r.json();
            title = title || movie.title;
            poster = poster || movie.poster_path;
          }
        } catch (e) {
          // ignore TMDB fetch errors, fallback to minimal data
        }
      }
    }

    // Normalize shape to { id, title, poster, rating }
    const payload = { id: Number(id), title: title || `movie-${id}`, poster: poster || null, rating: Number(rating) };

    // Save to local json-server at http://localhost:3001/ratings
    const check = await fetch(`http://localhost:3001/ratings/${payload.id}`);
    const existing = check.ok ? await check.json() : null;

    if (existing && existing.id) {
      // Update existing
      await fetch(`http://localhost:3001/ratings/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Create new
      await fetch(`http://localhost:3001/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: String(err) });
  }
}
