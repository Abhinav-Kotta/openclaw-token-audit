import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const generateViewport: () => Viewport = () => ({
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ec4899',
});

export const metadata: Metadata = {
  title: 'OpenClaw Token Audit Dashboard',
  description: 'Anime-themed dashboard for monitoring OpenClaw token usage and analytics',
  keywords: ['OpenClaw', 'Token Audit', 'Dashboard', 'Analytics', 'AI'],
  authors: [{ name: 'OpenClaw Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`} style={{ backgroundColor: '#0f0f23', color: '#ffffff', minHeight: '100vh' }}>
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2a2a4a 100%)' }}>
          {children}
        </div>
      </body>
    </html>
  );
}