'use client'
import React, { useEffect, useMemo, useState } from 'react'
import MovieCard, { Movie } from '../components/MovieCard'

export default function Page() {
  const [tab, setTab] = useState<'search'|'rated'>('search')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Movie[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 6

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('movie_ratings_v3')
      if(raw) setRatings(JSON.parse(raw))
    }catch(e){}
  },[])

  useEffect(()=>{ localStorage.setItem('movie_ratings_v3', JSON.stringify(ratings)) },[ratings])

  const onRate = (id:string, n:number)=>{ setRatings(s=>({...s,[id]:n})) }

  // search TMDB when query changes (debounce simple)
  useEffect(()=>{
    if(!query) { setResults([]); setLoading(false); return }
    let cancelled = false
    setLoading(true)
    const t = setTimeout(async ()=>{
      try{
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if(!cancelled) setResults(data.results || [])
      }catch(e){ console.error(e) }
      if(!cancelled) setLoading(false)
    }, 350)
    return ()=>{ cancelled=true; clearTimeout(t) }
  },[query])

  const filtered = useMemo(()=>{
    if(tab==='rated') return results.filter(r=> (ratings[r.id] ?? 0) > 0).concat(
      // also include rated items that are not in current results (search-independent)
      Object.keys(ratings).filter(id=> (ratings[id] ?? 0)>0 && !results.find(r=>r.id===id)).map(id=>({ id, title:'Rated movie', date:'', genres:[], overview:'', poster:null, vote_average:0 }))
    )
    return results
  },[tab, results, ratings])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  useEffect(()=>{ if(page>totalPages) setPage(totalPages) },[totalPages])
  const pageItems = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  return (
    <main className="container">
      <div className="card">
        <div className="topbar">
          <div className="tabs-row">
            <button className={tab==='search'? 'tab active':'tab'} onClick={()=>{setTab('search'); setPage(1)}}>Search</button>
            <button className={tab==='rated'? 'tab active':'tab'} onClick={()=>{setTab('rated'); setPage(1)}}>Rated</button>
          </div>
          <div className="search-row">
            <input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1) }} placeholder="Type to search..." />
          </div>
        </div>

        <div className="grid">
          {loading? <div className="empty">Loading...</div> : (
            pageItems.length===0 ? <div className="empty">No movies. Try searching.</div> : pageItems.map(m=> (
              <MovieCard key={m.id} movie={m} rating={ratings[m.id] ?? 0} onRate={onRate} />
            ))
          )}
        </div>

        <div className="pager">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>◀</button>
          {Array.from({length: totalPages}).map((_,i)=> (
            <button key={i} className={page===i+1? 'page active':'page'} onClick={()=>setPage(i+1)}>{i+1}</button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>▶</button>
        </div>
      </div>
    </main>
  )
}
