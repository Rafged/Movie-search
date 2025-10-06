'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

const GenresContext = createContext({ genres: {} });

export default function GenresProvider({ children }) {
  const [genres, setGenres] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/genres');
        const data = await r.json();
        const map = {};
        (data.genres || []).forEach(g => { map[g.id] = g.name; });
        setGenres(map);
      } catch (e) {
        console.error('failed genres', e);
      }
    }
    load();
  }, []);

  return <GenresContext.Provider value={{ genres }}>{children}</GenresContext.Provider>
}

export const useGenres = () => useContext(GenresContext);
