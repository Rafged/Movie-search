'use client'
import React from 'react';
import { Card, Rate } from 'antd';
import { getVoteColor } from '../utils/voteColor';
import { truncate } from '../utils/truncate';

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

export default function MovieList({ movies = [], onRate }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
      {movies.map(m => {
        const genres = m.genres
          ? m.genres.map(g => g.name).join(', ')
          : (m.genre_ids || []).map(id => GENRES[id] || id).join(', ');

        return (
          <Card key={m.id} hoverable>
            <div style={{ display:'flex', gap: 12 }}>
              {m.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} style={{ width: 100 }} />
              ) : null}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight:700 }}>{m.title}</div>
                {genres && <div style={{ fontSize:12, color:'#888' }}>{genres}</div>}
                <div style={{ fontSize:12 }}>{m.release_date}</div>
                <div style={{ marginTop:8 }}>{truncate(m.overview||'',120)}</div>
                <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  {/* ... остальное без изменений */}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}