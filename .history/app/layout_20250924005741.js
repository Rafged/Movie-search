import 'antd/dist/reset.css';
import './globals.css';

export const metadata = {
  title: 'Movie Search SSR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}