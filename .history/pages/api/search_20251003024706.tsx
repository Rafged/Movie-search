export default async function handler(req, res) {
  const key = proсуы.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY not set' });

  const { q, page } = req.query;

  try {
    const url = q
      ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&page=${page || 1}`
      : `https://api.themoviedb.org/3/discover/movie?page=${page || 1}`;

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${key}`,
        accept: "application/json",
      },
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}