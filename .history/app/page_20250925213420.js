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

  const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

function renderMovieCard(m) {
  const genres = (m.genre_ids || []).map(id => GENRES[id] || id).join(', ');

  return (
    <Card key={m.id} hoverable style={{ width: 220 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {m.poster_path ? <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} style={{ width: '100%' }} /> : null}
        <div style={{ fontWeight: 600 }}>{m.title}</div>
        {genres && <div style={{ fontSize: 12, color: '#888' }}>{genres}</div>}
        <div style={{ fontSize:12 }}>{m.release_date ? format(new Date(m.release_date),'MMM d, yyyy') : ''}</div>
        <div style={{ fontSize:13 }}>{truncate(m.overview || '', 120)}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ background: getVoteColor(m.vote_average || 0), color:'#000', padding:'4px 8px', borderRadius:6 }}>
            {(m.vote_average||0).toFixed(1)}
          </div>
          <Rate allowHalf value={(ratedMovies[m.id] && ratedMovies[m.id].rating) ? ratedMovies[m.id].rating/2 : 0} count={5} onChange={(v)=>handleRate(m.id, v*2)} />
        </div>
      </div>
    </Card>
  );
}

  return (
    <div style={{ padding: 80 }}>
      {offline && <Alert message="You are offline" type="warning" showIcon style={{ marginBottom:12 }} />}
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom:12 }} />}
      <Search placeholder="Search movies" value={q} onChange={onSearchChange} enterButton style={{ marginBottom:12 }} />
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Search" key="1">
          {loading ? <div style={{textAlign:'center', padding:40}}><Spin size="large" /></div> : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:12 }}>
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
