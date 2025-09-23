// Fetch rated movies for a guest session: GET ?guest_session_id=...
export default async function handler(req, res) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY not set' });
  const guest = req.query.guest_session_id;
  if (!guest) return res.status(400).json({ error: 'guest_session_id required' });
  const r = await fetch(`https://api.themoviedb.org/3/guest_session/${guest}/rated/movies?api_key=${key}`);
  const data = await r.json();
  res.status(r.status).json(data);
}
