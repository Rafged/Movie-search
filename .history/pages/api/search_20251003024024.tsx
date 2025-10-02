// Proxy endpoint for searching/discovering movies with server-side pagination.
// GET /api/search?q=...&page=1
export default async function handler(req, res) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY not set' });
  const { q, page } = req.query;
  try {
    const url = q
      ? `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(q)}&page=${page || 1}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=${key}&page=${page || 1}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
