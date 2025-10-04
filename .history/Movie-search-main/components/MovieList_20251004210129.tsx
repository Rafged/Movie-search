'use client'
import React from 'react';
import { Rate } from 'antd';
import { getVoteColor } from '../utils/voteColor';
import { truncate } from '../utils/truncate';
import RatingCircle from './RatingCircle';
import '../components/MovieList.css';


const GENRES: Record<number, string> = {
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


export default function MovieList({ movies = [], onRate, userRatings }: any) {
return (
<div className="movies-grid">
{movies.map((movie: any) => {
const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'Unknown';
const genres = movie.genre_ids?.map((id: number) => GENRES[id]).filter(Boolean).slice(0, 3);
{movies
  .filter((movie) => movie && movie.poster_path)
  .map

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
{genres?.map((g: string) => (
<span key={g} className="tag">{g}</span>
))}
</div>
<p className="desc">{truncate(movie.overview, 100)}</p>
<Rate
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