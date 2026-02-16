import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenClaw Token Audit Dashboard',
  description: 'Anime-themed dashboard for monitoring OpenClaw token usage and analytics',
  keywords: ['OpenClaw', 'Token Audit', 'Dashboard', 'Analytics', 'AI'],
  authors: [{ name: 'OpenClaw Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ec4899',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary">
          {children}
        </div>
      </body>
    </html>
  );
}