"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Genre = { id: number; name: string };
type ContextType = { genres: Genre[]; loading: boolean; error?: string };

const GenresContext = createContext<ContextType>({ genres: [], loading: true });

export function GenresProvider({ children }: { children: React.ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/tmdb/genres");
        if (!res.ok) throw new Error("Ошибка загрузки жанров");
        const data = await res.json();
        if (mounted) setGenres(data.genres || []);
      } catch (e: any) {
        setError(e.message || "Ошибка");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <GenresContext.Provider value={{ genres, loading, error }}>
      {children}
    </GenresContext.Provider>
  );
}

export const useGenres = () => useContext(GenresContext);
