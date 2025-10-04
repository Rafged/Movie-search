/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"], // ✅ разрешаем постеры с TMDB
  },
};

module.exports = nextConfig;