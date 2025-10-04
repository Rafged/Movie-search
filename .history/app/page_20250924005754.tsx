'use client';

import React, { useEffect, useState } from 'react';
import { Input, Spin, Alert, Pagination } from 'antd';

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('return'); // фиксированный запрос "return"

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=ВАШ_API_KEY`
        );
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [page, query]);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
      <h1>Movie Search SSR (client fetch)</h1>

      <Input.Search
        placeholder="Search movies..."
        enterButton
        onSearch={(value) => setQuery(value)}
        style={{ marginBottom: 20 }}
      />

      {loading && <Spin tip="Загрузка..." />}
      {error && <Alert type="error" message={error} />}

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>

      <Pagination
        current={page}
        onChange={(p) => setPage(p)}
        total={100} // можно заменить на data.total_results
        pageSize={20}
      />
    </div>
  );
}