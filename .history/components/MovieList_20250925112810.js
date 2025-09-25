import React from "react";
import { Rate } from "antd";

const MovieList = ({ movies, onRate }) => {
  const handleRateChange = (movieId, value) => {
    if (onRate) {
      onRate(movieId, value);
    }
  };

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-item">
          <h3>{movie.title}</h3>
          <p>{movie.overview}</p>

          {/* Звёзды с поддержкой половинок */}
          <Rate
            allowHalf
            value={movie.rating || 0}
            onChange={(value) => handleRateChange(movie.id, value)}
          />

          <p>Ваша оценка: {movie.rating || "не оценено"}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieList;