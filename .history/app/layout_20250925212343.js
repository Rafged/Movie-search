import 'antd/dist/reset.css';
import './globals.css';

export const metadata = {
  title: 'Movie Search',
};

import GuestInitializer from './GuestInitializer';
import GenresProvider from '../context/GenresContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><GuestInitializer />
          <GenresProvider>{children}</GenresProvider></body>
    </html>
  );
}