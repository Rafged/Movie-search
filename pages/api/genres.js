// Proxy to TMDB genres endpoint
export default async function handler(req, res) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY not set' });
  const r = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}`);
  const data = await r.json();
  res.status(200).json(data);
}
