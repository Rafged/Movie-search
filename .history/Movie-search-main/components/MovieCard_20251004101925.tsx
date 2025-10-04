import Image from "next/image";

interface MovieCardProps {
  title: string;
  posterPath: string | null;
  rating: number;
}

export default function MovieCard({ title, posterPath, rating }: MovieCardProps) {
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "/no-poster.png"; // запасное изображение

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-60 hover:scale-105 transition-transform">
      <Image
        src={imageUrl}
        alt={title}
        width={240}
        height={360}
        className="object-cover"
      />
      <div className="p-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">⭐ {rating}</p>
      </div>
    </div>
  );
}