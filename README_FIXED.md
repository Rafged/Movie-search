Movie Search - Fixed version
Files updated/created to restore:
- Tabs (Search / Rated)
- Movie cards grid with poster, rating, overview
- Search form that queries TMDB API
- Pagination component

How to use:
1. Copy your existing NEXT_PUBLIC_TMDB_API_KEY into .env.local in the root:
   NEXT_PUBLIC_TMDB_API_KEY=your_real_key_here

2. Install and run:
   npm install
   npm run dev

Notes:
- This is a minimal TypeScript Next.js app. Drop it into your project or run it as-is.
- It fetches from TMDB directly on the client side (requires your API key in NEXT_PUBLIC_TMDB_API_KEY).
