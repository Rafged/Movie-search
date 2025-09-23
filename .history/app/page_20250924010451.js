'use client';

import React, { useEffect, useState } from 'react';
import { Input, Spin, Alert, Pagination, Card, Rate, Tag } from 'antd';

const { Meta } = Card;

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('iron man'); // для теста сразу Iron Man
  const [total, setTotal] = useState(0);

  const API_KEY = ''; // сюда вставь ключ TMDB

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
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: 20 }}>
      <h1>Movie Search SSR (client fetch)</h1>

      <Input.Search
        placeholder="Search movies..."
        enterButton
        onSearch={(value) => {
          setQuery(value);
          setPage(1);
        }}
        style={{ marginBottom: 20, maxWidth: 400 }}
      />

      {loading && <Spin tip="Загрузка..." />}
      {error && <Alert type="error" message={error} />}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie.id}
            hoverable
            cover={
              movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 375,
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  No Image
                </div>
              )
            }
          >
            <Meta
              title={`${movie.title} (${movie.release_date?.slice(0, 4) || 'N/A'})`}
              description={
                <>
                  <p>
                    {movie.overview
                      ? movie.overview.slice(0, 120) + '...'
                      : 'No description'}
                  </p>
                  <Tag color="gold">
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </Tag>
                  <Rate
                    allowHalf
                    disabled
                    defaultValue={movie.vote_average / 2}
                  />
                </>
              }
            />
          </Card>
        ))}
      </div>

      {total > 20 && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Pagination
            current={page}
            onChange={(p) => setPage(p)}
            total={total}
            pageSize={20}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}