
'use client'
import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import GuestInitializer from './GuestInitializer';
import { useGenres } from '../context/GenresContext';
import MovieList from '../components/MovieList';
import { Input, Tabs, Pagination, Alert, Empty, Spin } from 'antd';

const { Search } = Input;

export default function Page() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'search'|'rated'>('search');
  const [movies, setMovies] = useState<any[]>([]);
  const genresCtx = useGenres();
  const genres = (genresCtx && genresCtx.genres) || {};

  const doSearch = async (q:string, p:number=1) => {
    if (!q) { setMovies([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent('${q}')} &page=${p}`);
    } catch(e){}
    setLoading(false);
  };

  const debouncedSearch = useCallback(debounce((val:string)=>{ setPage(1); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); /*call search*/ }, 400), []);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  useEffect(()=>{
    function onOnline(){ setIsOnline(true) }
    function onOffline(){ setIsOnline(false) }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return ()=>{ window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  },[]);

  const [error, setError] = useState<string|undefined>();

  useEffect(() => {
    const raw = localStorage.getItem('movie_ratings_v1');
    if (raw) setRatings(JSON.parse(raw));
  }, []);

  useEffect(() => {
    setError(undefined);
    if (tab === 'search') {
      fetchMovies(query, page);
    } else {
      // rated tab: gather rated movies from localStorage (we will fetch details for them)
      const ids = Object.keys(ratings).map(k => Number(k));
      if (ids.length === 0) {
        setMovies([]);
        setTotalPages(1);
        return;
      }
      // Fetch details for rated movies using public TMDB API key if available
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) {
        // Attempt to show basic info using the ids only
        setMovies(ids.map(id => ({ id, title: `Movie #${id}`, overview: 'Set NEXT_PUBLIC_TMDB_API_KEY to see details.' })));
        setTotalPages(1);
        return;
      }
      Promise.all(ids.map(id => fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`).then(r=>r.json()).catch(()=>null)))
        .then(res => {
          const filtered = res.filter(Boolean);
          setMovies(filtered);
          setTotalPages(1);
        }).catch(e => {
          console.error(e);
          setError('Не удалось загрузить оценённые фильмы: ' + String(e));
        });
    }
  }, [query, page, tab, ratings]);

  async function fetchMovies(q: string, p: number) {
    setLoading(true);
    setError(undefined);
    try {
      // Use server proxy first (requires TMDB_API_KEY in server env)
      const url = q ? `/api/search?q=${encodeURIComponent(q)}&page=${p}` : `/api/search?page=${p}`;
      const res = await fetch(url);
      const data = await res.json();
      // server may return error like { error: 'TMDB_API_KEY not set' }
      if (data && data.error) {
        // fallback: try client-side direct TMDB if NEXT_PUBLIC_TMDB_API_KEY present
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (apiKey) {
          const tmdbUrl = q
            ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}&page=${p}`
            : `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${p}`;
          const r2 = await fetch(tmdbUrl);
          const json2 = await r2.json();
          setMovies(json2.results || []);
          setTotalPages(json2.total_pages || 1);
        } else {
          setError('Server API error: ' + (data.error || 'unknown') + '. Set TMDB_API_KEY on the server or NEXT_PUBLIC_TMDB_API_KEY to enable direct client requests.');
          setMovies([]);
          setTotalPages(1);
        }
      } else {
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (e) {
      console.error(e);
      setError(String(e));
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  async function handleRate(movieId:number, value:number) {
    try {
      const guest = localStorage.getItem('tmdb_guest_session_id');
      if (!guest) { alert('Guest session not initialized'); return; }
      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ movie_id: movieId, value, guest_session_id: guest })
      });
      if (!res.ok) throw new Error('failed to rate');
      setRatings(prev=>({ ...prev, [movieId]: value }));
    } catch (e:any) {
      console.error(e);
      alert('Failed to send rating to server');
    }
  }

  const items = [
    { key: 'search', label: 'Search' },
    { key: 'rated', label: 'Rated' }
  ];

  return (
    <main style={{ padding: 24 }}>
      <GuestInitializer />
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>🎬 Фильмы</h1>

        <div style={{ marginBottom: 16 }}>
          <Tabs activeKey={tab} onChange={(k)=>setTab(k as any)} items={items} />
          {tab === 'search' && (
            <div style={{ marginBottom: 12 }}>
              <Search
                placeholder="Type to search..."
                enterButton="Search"
                value={query}
                onChange={e=>setQuery(e.target.value)}
                onSearch={(v)=>{ setPage(1); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); fetchMovies(v,1); }}
              />
            </div>
          )}
        </div>

        {error && <Alert type="error" message="Ошибка" description={error} style={{ marginBottom: 12 }} />}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
        ) : movies.length === 0 ? (
          <Empty description={error ? 'Ошибка' : 'Нет фильмов'} />
        ) : (
          <MovieList movies={movies} userRatings={ratings} onRate={handleRate} loading={loading} />
        )}

        <div style={{ textAlign:'center', marginTop:16 }}>
          {tab === 'search' && totalPages > 0 && (
            <Pagination current={page} total={totalPages*10} onChange={(p)=>{ setPage(p); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); fetchMovies(query,p); }} />
          )}
        </div>
      </div>
    </main>
  );
}
