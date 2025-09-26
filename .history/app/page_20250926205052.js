export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE || ''}/api/genres`, { cache: 'no-store' }).catch(()=>null);
  let genresMap = {};
  if (res && res.ok) {
    try {
      const data = await res.json();
      if (data && data.genres) {
        genresMap = Object.fromEntries(data.genres.map(g=>[g.id,g.name]));
      }
    } catch(e){}
  }
  // Render client component with genresMap
  const {default: PageClient} = await import('./PageClient.jsx');
  return <PageClient genresMap={genresMap} />;
}
