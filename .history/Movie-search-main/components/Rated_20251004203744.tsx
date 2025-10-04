'use client'
import React from 'react';
import { Rate } from 'antd';
import RatingCircle from './RatingCircle';
import { truncate } from '../utils/truncate';


export default function Rated({ ratedMovies = [], onRate }: any) {
  return (
    <div className="movies-grid">
      {ratedMovies.map((movie: any) => {
        const releaseDate = movie.release_date
          ? new Date(movie.release_date).toLocaleDateString()
          : 'Unknown';

        return (
          <div key={movie.id} className="movie-card">
            <div className="poster-wrapper">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-poster">No Image</div>
              )}
              <div className="rating-circle">
                <RatingCircle value={movie.vote_average} />
              </div>
            </div>

            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p className="date">{releaseDate}</p>
              <p className="desc">{truncate(movie.overview, 100)}</p>

              <Rate
                allowHalf
                value={movie.userRating || 0}
                onChange={(value) => onRate(movie.id, value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}