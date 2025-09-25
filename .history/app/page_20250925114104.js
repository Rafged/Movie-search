import { Rate } from "antd";
import { useState, useEffect } from "react";

export default function MovieRating({ movieId }) {
  const [ratedMovies, setRatedMovies] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ratedMovies");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const handleChange = (value) => {
    setRatedMovies((prev) => ({
      ...prev,
      [movieId]: value,
    }));
  };

  useEffect(() => {
    localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies));
  }, [ratedMovies]);

  return (
    <Rate
      allowHalf
      value={ratedMovies[movieId] || 0}
      onChange={handleChange}
    />
  );
}