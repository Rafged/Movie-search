"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Input, Spin, Alert, Pagination, Card, Rate, Tabs, message } from "antd";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import MovieList from "../components/MovieList";
import { truncate } from "../utils/truncate";
import { getVoteColor } from "../utils/voteColor";

const { Search } = Input;
const { TabPane } = Tabs;

export default function Page({ genresMap }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0); // 👈 правильное место

  const doSearch = useCallback(
    debounce(async (query: string, pageNumber: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          ``
        );
        const data = await res.json();

        setMovies(data.results || []);
        setTotalResults(data.total_results || 0); // 👈 сохраняем сюда общее количество
      } catch (err) {
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (q) {
      doSearch(q, page);
    }
  }, [q, page, doSearch]);

  return (
    <div>
      <Search
        placeholder="Search movies"
        enterButton
        onSearch={(value) => {
          setQ(value);
          setPage(1);
          doSearch(value, 1);
        }}
      />

      {loading && <Spin size="large" />}
      {error && <Alert type="error" message={error} />}

      <MovieList movies={movies} genresMap={genresMap} />

      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Pagination
          current={page}
          total={totalResults} // 👈 используем правильный стейт
          pageSize={10}
          onChange={(p) => {
            setPage(p);
            doSearch(q, p);
          }}
        />
      </div>
    </div>
  );
}