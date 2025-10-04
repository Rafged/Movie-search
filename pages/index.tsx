import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import Tabs from '../components/Tabs'
import Pagination from '../components/Pagination'

type Movie = {
  id:number;
  title:string;
  overview:string;
  poster_path:string | null;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

export default function Home() {
  const [tab, setTab] = useState<'search'|'rated'>('search')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState<Movie[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMovies()
  }, [tab, page])

  async function fetchMovies(q?: string) {
    setLoading(true)
    try {
      let url = ''
      if(tab === 'search') {
        const safeQ = encodeURIComponent(q ?? query ?? '')
        if((q ?? query) === '') {
          // default discover popular
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
        } else {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${safeQ}&page=${page}`
        }
      } else {
        // rated - top rated movies
        url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
      }
      const res = await fetch(url)
      const data = await res.json()
      setMovies(data.results || [])
      setTotalPages(data.total_pages || 1)
    } catch(err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    fetchMovies(query)
  }

  return (
    <div className="container">
      <header>
        <h1>Movie List</h1>
      </header>

      <Tabs active={tab} onChange={(t)=>{ setTab(t); setPage(1); setQuery('') }} />

      <form onSubmit={onSearchSubmit} className="searchForm" aria-label="search-form">
        <input
          placeholder="Type to search..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? <p>Loading...</p> : null}

      <main>
        {movies.length === 0 && !loading ? <p>No movies found.</p> : (
          <div className="grid">
            {movies.map(m => (
              <MovieCard key={m.id} movie={m} imageBase={IMAGE_BASE} />
            ))}
          </div>
        )}
      </main>

      <Pagination page={page} totalPages={totalPages} onChange={(p)=>{ setPage(p); window.scrollTo({top:0, behavior:'smooth'}) }} />

      <footer style={{textAlign:'center', padding:'20px 0'}}>Built with TMDB</footer>
    </div>
  )
}
