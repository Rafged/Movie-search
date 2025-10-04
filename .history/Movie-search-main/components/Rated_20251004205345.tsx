import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  genres: { id: number; name: string }[];
};

export default function RatedMovieCard({ movieId, rating }: { movieId: number; rating: number }) {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ru-RU`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Ошибка загрузки фильма:", err);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (!movie) return <div>Загрузка...</div>;

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p>{movie.genres.map((g) => g.name).join(", ")}</p>
      <p>⭐ {rating}</p>
    </div>
  );
}