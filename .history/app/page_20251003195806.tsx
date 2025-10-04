// Auto-generated server component (server-side rendering of TMDB movies)
import React from 'react';
import Link from 'next/link';
import RatingCircle from '../components/RatingCircle';

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
  genre_ids?: number[];
};

async function fetchMovies(query: string | null, page: number) {
  const apiKey = process.env.TMDB_API_KEY || '';
  const base = query
    ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    : `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;
  const res = await fetch(base, { cache: 'no-store' });
  if (!res.ok) throw new Error('TMDB fetch failed: ' + res.status);
  return res.json();
}


  const results: Movie[] = data.results || [];
  const total_results = data.total_results ?? 0;
  const pageSize = results.length || 20;
  const totalPages = Math.ceil(total_results / (pageSize || 20));

  return (
    <main>
      <h1>Фильмы</h1>
      {q ? <p>Результаты поиска для: "{q}"</p> : null}
      {results.length === 0 ? <p>ничего не найдено</p> : null}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12}}>
        {results.map((m) => (
          <article key={m.id} style={{position:'relative', border:'1px solid #eee', padding:12, borderRadius:8}}>
            <RatingCircle value={m.vote_average} />
            <h3>{m.title}</h3>
            <p>ID: {m.id}</p>
            <Link href={'/movie/' + m.id}>Открыть</Link>
          </article>
        ))}
      </div>

      <div style={{marginTop:20}}>
        <p>Страница {page} из {totalPages} — Всего результатов: {total_results}</p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {Array.from({length: totalPages}).map((_,i) => (
            <Link key={i} href={'?page=' + (i+1) + (q ? '&q=' + encodeURIComponent(q) : '')}>
              <button style={{padding:'6px 10px'}} disabled={i+1===page}>{i+1}</button>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
