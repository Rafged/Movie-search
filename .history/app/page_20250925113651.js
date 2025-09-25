"use client";

import React, { useState } from "react";
import { Rate } from "antd";

export default function Page() {
  const [movies, setMovies] = useState([
    { id: 1, title: "Фильм 1" },
    { id: 2, title: "Фильм 2" },
    { id: 3, title: "Фильм 3" },
  ]);

  const [ratings, setRatings] = useState({});

  const handleRateChange = (movieId, value) => {
    setRatings((prev) => ({
      ...prev,
      [movieId]: value,
    }));
  };

  return (
    <div>
      <h2>Список фильмов</h2>
      {movies.map((movie) => (
        <div key={movie.id} style={{ marginBottom: "20px" }}>
          <h3>{movie.title}</h3>
          <Rate
            allowHalf
            value={ratings[movie.id] || 0}
            onChange={(value) => handleRateChange(movie.id, value)}
          />
          <p>Ваша оценка: {ratings[movie.id] || "не оценено"}</p>
        </div>
      ))}
    </div>
  );
}