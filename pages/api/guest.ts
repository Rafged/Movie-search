// creates/stores a guest session in a simple cookie (in-memory not persistent)
// For production you'd persist session server-side or use secure cookies
export default async function handler(req, res) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY not set' });
  const r = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${key}`);
  const data = await r.json();
  res.status(200).json(data);
}
