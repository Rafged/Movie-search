'use client';

import React, { useEffect, useState } from 'react';
import {
  Input,
  Spin,
  Alert,
  Pagination,
  Card,
  Rate,
  Tag,
  Tabs,
  message,
} from 'antd';

const { Meta } = Card;

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('iron man');
  const [total, setTotal] = useState(0);

  // --- оценки ---
  const [ratedMovies, setRatedMovies] = useState({});

  const API_KEY = ''; // TMDB ключ

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
            <Tag color="gold">
              TMDB: ⭐ {userRating ?? movie.vote_average ? userRating ?? movie.vote_average.toFixed(1) : 'N/A'}
            </Tag>
            <br />
            <span>Моя оценка: </span>
            <Rate
              allowHalf
              value={ratedMovies[movie.id]?.myRating || 0}
              onChange={(value) => handleRate(movie, value)}
            />
          </>
        }
      />
    </Card>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: 20 }}>
      <h1>🎬 Movie Search SSR</h1>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Search" key="1">
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
            {movies.map(renderMovieCard)}
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
        </Tabs.TabPane>

        <Tabs.TabPane tab="Rated" key="2">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {Object.values(ratedMovies).length > 0 ? (
              Object.values(ratedMovies).map(renderMovieCard)
            ) : (
              <p>Вы пока не оценили фильмы</p>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}