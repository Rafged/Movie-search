'use client'
import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import GuestInitializer from './GuestInitializer';
import { useGenres } from '../context/GenresContext';
import MovieList from '../components/MovieList';
import { Input, Tabs, Pagination, Alert, Empty, Spin } from 'antd';

const { Search } = Input;
const items = [{ key: 'search', label: 'Search' }, { key: 'rated', label: 'Rated' }];

export default function Page() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'search'|'rated'>('search');
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|undefined>(undefined);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const genresCtx = useGenres();
  const genres = (genresCtx && (genresCtx as any).genres) || {};

  // Stable search function — always goes through server API (/api/search)
  const doSearch = useCallback(async (q: string, p = 1) => {
    setLoading(true);
    setError(undefined);
    try {
      const url = q ? `/api/search?q=${encodeURIComponent(q)}&page=${p}` : `/api/search?page=${p}`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(()=>({ error: 'unknown' }));
        setError(err.error || err.status_message || 'Search error');
        setMovies([]);
        setTotalPages(1);
      } else {
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
        setError(undefined);
      }
    } catch (e:any) {
      setError(String(e));
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced input handler — prevents fetch on every keystroke
  const debouncedSearch = useCallback(debounce((val: string) => {
    setPage(1); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    doSearch(val, 1);
  }, 400), [doSearch]);

  useEffect(() => {
    // load persisted ratings
    const raw = (typeof window !== 'undefined') ? localStorage.getItem('movie_ratings_v1') : null;
    if (raw) {
      try { setRatings(JSON.parse(raw)); } catch {}
    }
    // initial load (discover)
    doSearch('', page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for input change — update state and call debounced search
  function onInputChange(e: any) {
    const v = e.target.value;
    setQuery(v);
    debouncedSearch(v);
  }

  // When user presses Enter in search box
  function onSearchEnter(v: string) {
    setPage(1); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    doSearch(v, 1);
  }

  // Pagination handler — always go through server API
  function onPageChange(p: number) {
    setPage(p); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    doSearch(query, p);
  }

  // Load rated movies (either from server TMDB guest session or from local storage)
  async function loadRatedMovies() {
    setLoading(true);
    setError(undefined);
    try {
      const guest = typeof window !== 'undefined' ? localStorage.getItem('tmdb_guest_session_id') : null;
      if (guest) {
        const res = await fetch(`/api/rated?guest_session_id=${guest}`);
        if (res.ok) {
          const data = await res.json();
          setMovies(data.results || []);
          setTotalPages(1);
          return;
        }
      }
      // Fallback: local stored ratings
      const raw = typeof window !== 'undefined' ? localStorage.getItem('movie_ratings_v1') : null;
      if (!raw) {
        setMovies([]);
        setTotalPages(1);
        return;
      }
      const local = JSON.parse(raw || '{}');
      const ids = Object.keys(local).map(k => Number(k));
      if (ids.length === 0) {
        setMovies([]);
        setTotalPages(1);
        return;
      }
      // fetch details for each id via server-side proxy /api/movie to avoid exposing TMDB key
      const detailsPromises = ids.map(id => fetch(`/api/movie?id=${id}`).then(r => r.ok ? r.json().catch(()=>null) : null));
      const details = await Promise.all(detailsPromises);
      const merged = details.map((d: any, idx: number) => ({ ...(d || { id: ids[idx], title: `Movie #${ids[idx]}` }), rating: local[ids[idx]] }));
      setMovies(merged);
      setTotalPages(1);
    } catch (e:any) {
      console.error('loadRatedMovies error', e);
      setError(String(e));
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  // React to tab changes
  useEffect(() => {
    if (tab === 'search') {
      // show search/discover results
      doSearch(query, page);
    } else {
      loadRatedMovies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page, ratings]);

  return (
    <div style={{ padding: 16 }}>
      <GuestInitializer />
      <Tabs activeKey={tab} onChange={(k)=>setTab(k as any)} items={items} />
      <div style={{ marginTop: 12 }}>
        <Search
          placeholder="Search movies..."
          enterButton
          value={query}
          onChange={onInputChange}
          onSearch={onSearchEnter}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        {error && <Alert message={error} type="error" />}
        {loading && <Spin />}

        {!loading && movies.length === 0 && <Empty description="No movies found" />}

        <MovieList movies={movies} userRatings={ratings} onRate={(id:number, value:number) => {
          // emit rating to /api/rate so it goes through server
          const guest = typeof window !== 'undefined' ? localStorage.getItem('tmdb_guest_session_id') : null;
          const payload: any = { movie_id: id, value: value };
          if (guest) payload.guest_session_id = guest;
          fetch('/api/rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).then(res => res.json()).then(res => {
            // persist local copy
            try {
              const raw = localStorage.getItem('movie_ratings_v1') || '{}';
              const obj = JSON.parse(raw || '{}');
              obj[id] = value;
              localStorage.setItem('movie_ratings_v1', JSON.stringify(obj));
              setRatings(obj);
            } catch {}
            if (!res || !res.success) {
              console.warn('rate failed', res);
            }
          }).catch(console.error);
        }} />

        <div style={{ marginTop: 16 }}>
          <Pagination current={page} total={totalPages*10} pageSize={10} onChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}
