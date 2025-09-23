// Proxy endpoint for rating a movie. Expects POST { movie_id, value, guest_session_id }
export default async function handler(req, res) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY not set' });
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { movie_id, value, guest_session_id } = req.body;
    if (!movie_id || !value || !guest_session_id) return res.status(400).json({ error: 'missing' });
    const r = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/rating?api_key=${key}&guest_session_id=${guest_session_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value })
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
