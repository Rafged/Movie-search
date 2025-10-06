'use client'
import React from 'react';
import { useGenres } from '../context/GenresContext';
import { Rate } from 'antd';
import { getVoteColor } from '../utils/voteColor';
import { truncate } from '../utils/truncate';
import RatingCircle from './RatingCircle';
import '../components/MovieList.css';



export default function MovieList({ movies = [], onRate, userRatings }: any) {
    const { genres: genresMap } = useGenres();
  return (
<div className="movie-list">
{movies
  .filter((movie: any) => movie && movie.poster_path)
  .map((movie: any) => {
    const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'Unknown';
    const movieGenres = movie.genre_ids?.map((id: number) => genresMap[id]).filter(Boolean).slice(0, 3);

    return (
      <div key={movie.id ?? `${movie.title}-${Math.random()}`} className="movie-card">
        <div className="poster-wrapper">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <div className="rating-circle">
            <RatingCircle value={movie.vote_average} />
          </div>
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p className="date">{releaseDate}</p>
          <div className="tags">
            {movieGenres?.map((g: string) => (
              <span key={g} className="tag">{g}</span>
            ))}
          </div>
          <p className="desc">{truncate(movie.overview, 100)}</p>
          <Rate
            style={{ color: getVoteColor(movie.vote_average) }}
            allowHalf
            value={userRatings?.[movie.id] || 0}
            onChange={(value) => onRate(movie.id, value)}
          />
        </div>
      </div>
    );
  })}
</div>
);
}