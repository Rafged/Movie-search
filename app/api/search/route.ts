  import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const q = url.searchParams.get('q') || ''
    if (!q) return NextResponse.json({ results: [] })
    const apiKey = process.env.TMDB_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'TMDB_API_KEY not set' }, { status: 500 })
    const tmdb = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}&page=1&include_adult=false`)
    const data = await tmdb.json()
    // map to simplified structure
    const results = (data.results || []).map((m: any) => ({
      id: String(m.id),
      title: m.title || m.name,
      date: m.release_date || m.first_air_date || '',
      genres: [],
      overview: m.overview || '',
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      vote_average: m.vote_average ?? 0
    }))
    return NextResponse.json({ results })
  }
