# Movie Search — SSR Next.js scaffold

What this archive includes (best-effort scaffold):

- Server Components: `app/page.js` fetches TMDB server-side (supports server pagination).
- Ant Design UI: uses Rate, Input, Tabs, Pagination, Spin, Alert.
- Debounce: `lodash.debounce` used for search input.
- Guest session init + proxy endpoint: `pages/api/rate.js` creates/uses TMDB guest session and proxies rating requests.
- Genres loaded into React Context (`context/GenresContext.js`) and used to display genre names.
- `utils/truncate.js` prevents breaking words.
- `date-fns` used to format dates.
- Loading indicator: `app/loading.js`.
- Rating badge with color scale.

## Environment variables (create a `.env.local` file)
- `TMDB_API_KEY` — Required. Your TMDB API key.
- `NEXT_PUBLIC_API_BASE` — Optional. Defaults to `http://localhost:3000/api`.

## How to run
1. Extract this zip.
2. `cd movie-search-ssr-nextjs`
3. `npm install`
4. Create `.env.local` with `TMDB_API_KEY=your_key`
5. `npm run dev`

Notes:
- The project is a scaffold. Replace API_KEY and test the proxy endpoints.
- If you want to deploy to Vercel, set the `TMDB_API_KEY` in project settings.
