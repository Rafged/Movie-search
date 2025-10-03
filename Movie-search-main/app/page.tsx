import PageClient from "./PageClient";

export default async function Page() {
  let data = null;
  let genresMap = {};

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
      { next: { revalidate: 60 } }
    );
    data = await res.json();

    // Преобразуем жанры в map, если нужно
    const genresRes = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const genresData = await genresRes.json();
    genresMap = (genresData?.genres || []).reduce((acc: any, genre: any) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  } catch (e) {
    console.error("Ошибка загрузки данных:", e);
  }

  return <PageClient genresMap={genresMap} moviesData={data} />;
}