'use client'
import React from 'react';
import MovieList from './MovieList';

export default function Rated({ ratedMovies = [], onRate }) {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Rated Movies</h2>
      {ratedMovies.length > 0 ? (
        <MovieList movies={ratedMovies} onRate={onRate} />
      ) : (
        <p>Вы ещё не оценили фильмы</p>
      )}
    </div>
  );
}
