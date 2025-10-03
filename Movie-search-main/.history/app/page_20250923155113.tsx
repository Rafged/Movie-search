import React from 'react';
import { Input, Tabs, Pagination, Spin, Alert } from 'antd';
import MovieList from '../components/MovieList';
import GenresProvider, { useGenres } from '../context/GenresContext';
import { format } from 'date-fns';
import debounce from 'lodash.debounce';

const { Search } = Input;
const { TabPane } = Tabs || {};

async function fetchMovies(query, page=1) {
  const apiKey = process.env.TMDB_API_KEY;
  const base = 'https://api.themoviedb.org/3';
  const url = query
    ? `${base}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    : `${base}/discover/movie?api_key=${apiKey}&page=${page}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('TMDB fetch failed');
  return res.json();
}

export default async function Page({ searchParams }) {
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  let data;
  try {
    data = await fetchMovies(q, page);
  } catch (e) {
    return (
      <div style={{ padding: 24 }}>
        <Alert message="Ошибка загрузки данных" description={e.message} type="error" showIcon />
      </div>
    )
  }

  return (
    <GenresProvider>
      <div style={{ maxWidth: 1000, margin: '24px auto', padding: 16 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 16 }}>Movie Search (SSR)</h1>
        <div style={{ marginBottom: 12 }}>
          <Search
            placeholder="Search movies..."
            defaultValue={q}
            enterButton
            onSearch={(val) => {
              // navigate with query params — client can update window.location
              const params = new URLSearchParams(window.location.search);
              if (val) params.set('q', val); else params.delete('q');
              params.set('page', '1');
              window.location.search = params.toString();
            }}
          />
        </div>

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Search/Discover" key="1">
            <MovieList movies={data.results} />
            <div style={{ textAlign:'center', marginTop: 16 }}>
              <Pagination
                current={data.page}
                total={data.total_results}
                pageSize={20}
                showSizeChanger={false}
                onChange={(p) => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('page', String(p));
                  window.location.search = params.toString();
                }}
              />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Rated (TMDB)" key="2">
            <RatedTab />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </GenresProvider>
  )
}

function RatedTab() {
  'use client';
  import React, { useEffect, useState } from 'react';
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/rated');
        if (!r.ok) throw new Error('Failed to fetch rated');
        const data = await r.json();
        setMovies(data.results || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={{textAlign:'center'}}><Spin /></div>;
  if (error) return <Alert message="Ошибка" description={error} type="error" showIcon />;
  if (!movies || movies.length === 0) return <Alert message="Нет оценённых фильмов" type="info" showIcon />;

  return <MovieList movies={movies} />;
}
