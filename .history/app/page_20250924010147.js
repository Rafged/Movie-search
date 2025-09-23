'use client';

import React, { useEffect, useState } from 'react';
import { Input, Spin, Alert, Pagination } from 'antd';

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('return');
  const [total, setTotal] = useState(0);

  const API_KEY = '8b9cadaddd5fdf77e1118c4b03b79f77 // вставь ключ отсюда: https://www.themoviedb.org/settings/api

  async function fetchMovies() {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}&page=${page}&api_key=${API_KEY}&language=en-US`
      );

      if (!res.ok) throw new Error('Ошибка загрузки');

      const data = await res.json();
      setMovies(data.results || []);
      setTotal(data.total_results || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [page, query]);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
      <h1>Movie Search SSR (client fetch)</h1>

      <Input.Search
        placeholder="Search movies..."
        enterButton
        onSearch={(value) => {
          setQuery(value);
          setPage(1);
        }}
        style={{ marginBottom: 20 }}
      />

      {loading && <Spin tip="Загрузка..." />}
      {error && <Alert type="error" message={error} />}

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>

      {total > 20 && (
        <Pagination
          current={page}
          onChange={(p) => setPage(p)}
          total={total}
          pageSize={20}
        />
      )}
    </div>
  );
}