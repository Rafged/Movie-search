// Auto-generated server component (server-side rendering of TMDB movies)
import React from 'react';
import Link from 'next/link';
import RatingCircle from '../components/RatingCircle';

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
  genre_ids?: number[];
};

async function fetchMovies(page: number = 1) {
  const base = `https://api.themoviedb.org/3/discover/movie?page=${page}`;

  const res = await fetch(base, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`, // V4 Token из .env.local
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
    <main>
      <h1>Movie List</h1>
      <ul>
        {data.results.map((movie: any) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </main>
  );
}