'use client'
import React from 'react';
import { Card, Rate, Badge } from 'antd';
import { getVoteColor } from '../utils/voteColor';
import { truncate } from '../utils/truncate';
import Image from 'next/image';

export default function MovieList({ movies }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
      {movies.map(m => (
        <Card key={m.id} hoverable>
          <div style={{ display:'flex', gap: 12 }}>
            {m.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} style={{ width: 100 }} />
            ) : <div style={{ width:100, height:150, background:'#eee' }} />}
            <div style={{ flex:1 }}>
              <h3 style={{ margin:0 }}>{m.title}</h3>
              <div style={{ marginTop:6, marginBottom:6 }}>{truncate(m.overview || '', 120)}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <Rate allowHalf disabled value={m.vote_average / 2} />
                </div>
                <div>
                  <Badge style={{ backgroundColor: getVoteColor(m.vote_average), color: '#fff' }} count={Math.round(m.vote_average * 10) / 10} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
