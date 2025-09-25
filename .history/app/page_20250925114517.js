'use client';

import React, { useEffect, useState } from 'react';
import {
  Input,
  Spin,
  Alert,
  Pagination,
  Card,
  Rate,
  Tabs,
  message,
} from 'antd';

const { Meta } = Card;

export default function Page() {
  const [rating, setRating] = useState(0);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(''); // 🔹 пустая строка (ничего не ищем при заходе)
  const [total, setTotal] = useState(0);

  // --- оценки ---
  const [ratings, setRatings] = useState({});

  const handleRateChange = (movieId, value) => {
    setRatings((prev) => ({
      ...prev,
      [movieId]: value,
    }));
  };

  const API_KEY = '8b9cadaddd5fdf77e1118c4b03b79f77'; // TMDB ключ

  // загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ratedMovies');
    if (saved) setRatedMovies(JSON.parse(saved));
  }, []);

  // сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
  }, [ratedMovies]);

  async function fetchMovies() {
    if (!query) return; // 🔹 если нет запроса — не грузим

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

  // 🔹 Загружаем только если есть query
  useEffect(() => {
    if (query) fetchMovies();
  }, [page, query]);

  const handleRate = (movie, value) => {
    if (value === 0) {
      // если обнулили рейтинг — удаляем
      const updated = { ...ratedMovies };
      delete updated[movie.id];
      setRatedMovies(updated);
      message.info(`Удалена оценка для ${movie.title}`);
    } else {
      const updated = {
        ...ratedMovies,
        [movie.id]: { ...movie, myRating: value },
      };
      setRatedMovies(updated);
      message.success(`Вы оценили ${movie.title} на ${value}⭐`);
    }
  };

  const renderMovieCard = (movie) => (
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
            <Rate
  allowHalf
  value={rating}
  onChange={(value) => setRating(value)}
/>
          </>
        }
      />
    </Card>
  );

  return (
    <div style={{ padding: 20 }}>
      {/* 🔹 Центрируем Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: 'Search',
              key: '1',
              children: (
                <div>
                  <Input.Search
                    placeholder="Search movies..."
                    enterButton="Search"
                    size="large"
                    onSearch={(value) => {
                      setQuery(value);
                      setPage(1);
                    }}
                    style={{ marginBottom: 20, maxWidth: 400, marginInline: 'auto', display: 'block' }}
                  />

                  {loading && <Spin size="large" />}
                  {error && <Alert type="error" message={error} />}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: 20,
                    }}
                  >
                    {movies.map(renderMovieCard)}
                  </div>
                  {total > 20 && (
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={20}
                      onChange={(p) => setPage(p)}
                      style={{ marginTop: 20, textAlign: 'center' }}
                    />
                  )}
                </div>
              ),
            },
            {
              label: 'Rated',
              key: '2',
              children: (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 20,
                  }}
                >
                  {Object.values(ratedMovies).map(renderMovieCard)}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}