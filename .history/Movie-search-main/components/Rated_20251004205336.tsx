"use client";
import React, { useEffect, useState } from "react";

type RatedMovie = {
  id: number;
  rating: number;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  genres: { id: number; name: string }[];
};

export default function Rated() {
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [moviesDetails, setMoviesDetails] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("ratedMovies");
    if (stored) {
      const parsed: RatedMovie[] = JSON.parse(stored);
      setRatedMovies(parsed);

      // Загружаем детали всех фильмов
      Promise.all(
        parsed.map((m) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${m.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ru-RU`
          ).then((res) => res.json())
        )
      ).then(setMoviesDetails);
    }
  }, []);

  return (
    <div className="movies-grid">
      {moviesDetails.map((movie, index) => {
        const rated = ratedMovies.find((r) => r.id === movie.id);

        return (
          <div key={movie.id ?? `rated-${index}`} className="movie-card">
            <div className="poster-wrapper">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="poster-placeholder">No poster</div>
              )}
            </div>

            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>
                {movie.genres?.map((g) => (
                  <span key={g.id}>{g.name} </span>
                ))}
              </p>
              <p>⭐ {rated?.rating ?? 0}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}