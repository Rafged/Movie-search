'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from 'antd';
import MovieCard, { Movie } from '../components/MovieCard'

export default function Page() {
  const [tab, setTab] = useState<'search'|'rated'>('search')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Movie[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 6

  useEffect(() => {
    let cancelled = false
    if (!query) { setResults([]); return; }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (!cancelled) setResults(data.results || [])
      } catch (e) {
        console.error("search error", e)
        if (!cancelled) setResults([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)
    return () => { cancelled = true; clearTimeout(t) }
  }, [query])

  const onRate = (id: string, n: number) => { setRatings(s => ({ ...s, [id]: n })) }

  const filtered = useMemo(() => {
    if (tab === 'rated') {
      const ratedFromResults = results.filter(r => (ratings[r.id] ?? 0) > 0)
      const existingIds = new Set(results.map(r => r.id))
      const ratedExtra = Object.keys(ratings)
        .filter(id => (ratings[id] ?? 0) > 0 && !existingIds.has(id))
        .map(id => ({ id, title: 'Unknown', release_date: '', genres: [], overview: '', poster: null, vote_average: 0 } as unknown as Movie))
      return ratedFromResults.concat(ratedExtra)
    }
    return results
  }, [tab, results, ratings])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages])
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main className="container">
      <div className="card">
        <div className="topbar">
          <div className="tabs-row">
            <button className={tab === 'search' ? 'tab active' : 'tab'} onClick={() => { setTab('search'); setPage(1) }}>Search</button>
            <button className={tab === 'rated' ? 'tab active' : 'tab'} onClick={() => { setTab('rated'); setPage(1) }}>Rated</button>
          </div>
          <div className="search-row">
            <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} placeholder="Type to search..." />
          </div>
        </div>

        <div className="grid">
          {pageItems.length === 0 ? (
            <div className="empty">No results</div>
          ) : (
            pageItems.map(m => (
              <MovieCard key={m.id} movie={m} rating={ratings[m.id] ?? 0} onRate={onRate} />
            ))
          )}
        </div>

        <div className="pager">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>◀</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className={page === i + 1 ? 'page active' : 'page'} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>▶</button>
        </div>
      </div>
    </main>
  )
}
