async function fetchMovies(page: number = 1) {
  const url = `https://api.themoviedb.org/3/discover/movie?page=${page}`;

  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`); {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`, // v4 токен из .env.local
      'Content-Type': 'application/json;charset=utf-8',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('TMDB fetch failed: ' + res.status);
  }

  return res.json();
}

export default async function Page() {
  const data = await fetchMovies(1);

  return (
    <main style={{ padding: "20px" }}>
      <h1>🎬 Movie List</h1>
      <ul>
        {data.results.map((movie: any) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </main>
  );
}