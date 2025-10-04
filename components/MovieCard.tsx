import React from 'react'

type Movie = {
  id:number;
  title:string;
  overview:string;
  poster_path:string | null;
  release_date?: string;
  vote_average?: number;
}

export default function MovieCard({ movie, imageBase }: { movie: Movie, imageBase: string }) {
  const poster = movie.poster_path ? (imageBase + movie.poster_path) : '/no-poster.png'
  return (
    <article className="card">
      <img src={poster} alt={movie.title} />
      <div className="cardBody">
        <h3>{movie.title}</h3>
        <div className="meta">
          <small>{movie.release_date}</small>
          <span className="rating">{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</span>
        </div>
        <p className="overview">{movie.overview}</p>
      </div>
    </article>
  )
}
