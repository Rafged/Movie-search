import './globals.css';
import 'antd/dist/reset.css';
export const metadata = { title: 'Movie Search' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}