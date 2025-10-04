'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Input, Spin, Alert, Pagination, Card, Rate, Tabs, message } from 'antd';
import debounce from 'lodash.debounce';
import { format } from 'date-fns';
import MovieList from '../components/MovieList';
import { truncate } from '../utils/truncate';
import { getVoteColor } from '../utils/voteColor';

const { Search } = Input;
const { TabPane } = Tabs;

export default function Page() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [ratedMovies, setRatedMovies] = useState({});

  useEffect(() => {
    function onOnline() { setOffline(false); }
    function onOffline() { setOffline(true); }
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const doSearch = useCallback(async (searchQ, p=1) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/search?q=${encodeURIComponent(searchQ||'')}&page=${p}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('search failed');
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // debounce user typing
  const debounced = useCallback(debounce((val)=>{ setPage(1); doSearch(val,1); }, 350), [doSearch]);

  function onSearchChange(e) {
    setQ(e.target.value);
    debounced(e.target.value);
  }

  useEffect(() => {
    // initial load (discover)
    doSearch('', page);
  }, []);

  // fetch rated movies for guest session
  async function loadRated() {
    try {
      const guest = localStorage.getItem('tmdb_guest_session_id');
      if (!guest) return;
      const res = await fetch(`/api/rated?guest_session_id=${guest}`);
      if (!res.ok) throw new Error('failed to load rated');
      const data = await res.json();
      const map = {};
      (data.results || []).forEach(m => { map[m.id] = m; });
      setRatedMovies(map);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => { loadRated(); }, []);

  async function handleRate(movieId, value) {
    try {
      const guest = localStorage.getItem('tmdb_guest_session_id');
      if (!guest) { message.error('Guest session not initialized'); return; }
      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ movie_id: movieId, value, guest_session_id: guest })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.status_message || 'rate failed');
      message.success('Rated');
      // refresh rated list
      await loadRated();
    } catch (e) {
      message.error(e.message || 'Error');
    }
  }

  
  return (
    <div style={{ padding: 20 }}>
      {offline && <Alert message="You are offline" type="warning" showIcon style={{ marginBottom:12 }} />}
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom:12 }} />}
      <Search placeholder="Search movies" value={q} onChange={onSearchChange} enterButton style={{ marginBottom:12 }} />
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Search" key="1">
          {loading ? <div style={{textAlign:'center', padding:40}}><Spin size="large" /></div> : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
                {movies.map(renderMovieCard)}
              </div>
              <div style={{ textAlign:'center', marginTop:12 }}>
                <Pagination current={page} total={totalPages*10} pageSize={10} onChange={(p)=>{ setPage(p); doSearch(q,p); }} />
              </div>
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rated" key="2">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
            {Object.values(ratedMovies).map(renderMovieCard)}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
