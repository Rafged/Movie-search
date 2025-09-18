'use client'
import React from 'react'
export type Movie = {
  id: string
  title: string
  date: string
  genres: string[]
  overview: string
  poster: string | null
  vote_average?: number
}
export default function MovieCard({ movie, rating, onRate }: { movie: Movie; rating: number; onRate: (id:string,n:number)=>void }) {
  return (
    <article className="movie">
      <img className="poster" src={movie.poster ?? 'https://via.placeholder.com/300x420?text=No+Image'} alt={movie.title} />
      <div className="meta">
        <div className="metaTop">
          <div>
            <h3 className="title">{movie.title}</h3>
            <div className="date">{movie.date}</div>
            <div className="genres">{movie.genres.join(' • ')}</div>
          </div>
          <div className="tmdb-score">{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</div>
        </div>
        <p className="overview">{movie.overview}</p>
        <div className="stars" role="radiogroup" aria-label={`Rate ${movie.title}`}>
          {Array.from({ length: 10 }).map((_, idx) => {
            const i = idx + 1
            return (
              <button key={i} title={`${i}/10`} className={i<=rating ? 'star on' : 'star'} onClick={()=>onRate(movie.id, i)}>
                ★
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}
