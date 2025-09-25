import { Rate } from "antd";
import { useEffect, useState } from "react";

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
      allowHalf       // ✅ вот это ключ к половинкам
      value={ratedMovies[movieId] || 0}
      onChange={handleChange}
    />
  );
}