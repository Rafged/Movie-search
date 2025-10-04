'use client'
import React from 'react';
import { Card, Rate } from 'antd';
import { getVoteColor } from '../utils/voteColor';
import { truncate } from '../utils/truncate';

export default function MovieList({ movies = [], onRate }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
      {movies.map(m => (
        <Card key={m.id} hoverable>
          <div style={{ display:'flex', gap: 12 }}>
            {m.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} style={{ width: 100 }} />
            ) : null}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight:700 }}>{m.title}</div>
              <div style={{ fontSize:12 }}>{m.release_date}</div>
              <div style={{ marginTop:8 }}>{truncate(m.overview||'',120)}</div>
              <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ background: getVoteColor(m.vote_average||0), padding:'4px 8px', borderRadius:6 }}>{(m.vote_average||0).toFixed(1)}</div>
                <Rate allowHalf value={(m.user_rating ? m.user_rating/2 : 0)} onChange={(v)=>onRate && onRate(m.id, v*2)} />
                
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
