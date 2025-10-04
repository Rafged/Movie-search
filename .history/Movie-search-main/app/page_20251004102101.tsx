import MovieCard from "../components/MovieCard";

async function fetchMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
  );
  if (!res.ok) throw new Error("TMDB fetch failed: " + res.status);
  return res.json();
}

export default async function Page() {
  const data = await fetchMovies();
  const movies = data.results;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Movie List</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            rating={movie.vote_average}
          />
        ))}
      </div>
    </main>
  );
}