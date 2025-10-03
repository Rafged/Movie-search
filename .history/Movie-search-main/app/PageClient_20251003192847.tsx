"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import RatedSection from "../components/RatedSection";
import { Pagination } from "antd";

export default function PageClient({ genresMap, moviesData }) {
  const [page, setPage] = useState(1);

  if (!moviesData || !moviesData.results) {
    return <div>Нет фильмов</div>;
  }

  return (
    <div>
      {/* Поиск */}
      <SearchBar />

      {/* Список фильмов */}
      <MovieList movies={moviesData.results} genresMap={genresMap} />

      {/* Оцененные фильмы */}
      <RatedSection />

      {/* Пагинация */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Pagination
          current={page}
          total={moviesData.total_results}
          pageSize={10}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}