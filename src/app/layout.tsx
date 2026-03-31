import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/layout/NavBar';

export const metadata: Metadata = {
  title: 'Space Rooms',
  description: 'Real-time equipment and presence dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
