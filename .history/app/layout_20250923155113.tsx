import 'antd/dist/reset.css';
import './globals.css';

export const metadata = {
  title: 'Movie Search SSR',
  description: 'Search movies with TMDB - Server Side'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
