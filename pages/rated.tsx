import fs from 'fs';
import path from 'path';
import React from 'react';
import Link from 'next/link';

export default function RatedPage({ ratings }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Rated movies (server-side)</h1>
      <p>Эта страница рендерится на сервере с использованием <code>getServerSideProps</code>.</p>
      {ratings && ratings.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
          {ratings.map((r, i) => (
            <div key={i} style={{ border:'1px solid #ddd', padding:10, borderRadius:8 }}>
              <h3>Movie ID: {r.movieId}</h3>
              <p>Rating: {r.rating}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No ratings found. Если вы хотите, чтобы на этой странице отображались реальные фильмы — добавьте записи в <code>data/ratings.json</code> или используйте TMDB с правильным TMDB_API_KEY.</p>
        </div>
      )}
      <div style={{ marginTop:20 }}>
        <Link href="/"><a>← Back to home</a></Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const dataPath = path.join(process.cwd(), 'data', 'ratings.json');
  let ratings = [];
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8') || '[]';
    ratings = JSON.parse(raw);
  } catch (e) {
    ratings = [];
  }
  return {
    props: { ratings }
  };
}
