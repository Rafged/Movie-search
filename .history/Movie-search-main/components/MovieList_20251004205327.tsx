"use client";
import React from "react";
import Rating from "./Rating"; // если у тебя есть компонент рейтинга

type Genre = { id: number; name: string };

type Movie = {
  id?: number | string;
  title?: string;
  poster_path?: string | null;
  genres?: Genre[];
};

export default function MovieList({ movies }: { movies: Movie[] }) {
  if (!movies || movies.length === 0) return <div>Нет фильмов</div>;

  return (
    <div className="movies-grid">
      {movies.map((movie, index) => {
        const uniqueKey =
          movie.id !== undefined ? String(movie.id) : `movie-${index}`;

        return (
          <div key={uniqueKey} className="movie-card">
            <div className="poster-wrapper">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title ?? "poster"}
                />
              ) : (
                <div className="poster-placeholder">No poster</div>
              )}
            </div>

            <div className="movie-info">
              <h3>{movie.title ?? `Movie #${movie.id ?? index}`}</h3>

              <p className="genres">
                {movie.genres && movie.genres.length > 0 ? (
                  movie.genres.map((g) => (
                    <span key={g.id ?? `${g.name}-${index}`}>{g.name}</span>
                  ))
                ) : (
                  <>Unknown</>
                )}
              </p>

              <div className="rating">
                <Rating movieId={movie.id ?? index} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}