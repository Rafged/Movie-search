import { useEffect, useState } from 'react';

type Movie = {
  id: number;
  title: string;
  poster_path?: string | null;
  genres?: { id: number; name: string }[];
  overview?: string;
};

export default function RatedMovieCard({ movieId, rating }: { movieId: number; rating: number }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchMovie() {
      setLoading(true);
      try {
        const res = await fetch(`/api/movie?id=${movieId}`);
        if (!res.ok) {
          // try to parse json error or fallback to minimal info
          const txt = await res.text();
          console.warn('movie api failed', txt);
          if (!mounted) return;
          setMovie({ id: movieId, title: `Movie #${movieId}` });
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setMovie(data);
      } catch (e) {
        console.error('failed load movie', e);
        if (!mounted) return;
        setMovie({ id: movieId, title: `Movie #${movieId}` });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMovie();
    return () => { mounted = false; }
  }, [movieId]);

  if (loading || !movie) return <div>Загрузка...</div>;

  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '100%' }} />
      ) : <div style={{ width: '100%', height: 200, background: '#eee' }} />}
      <h3>{movie.title}</h3>
      {movie.genres && <p>{movie.genres.map(g => g.name).join(', ')}</p>}
      <p>{movie.overview}</p>
      <p>⭐ {rating}</p>
    </div>
  );
}
