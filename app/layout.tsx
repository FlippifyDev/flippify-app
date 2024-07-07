import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { Metadata } from 'next'


const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'Flippify',
  description: 'Your ultimate platform for flipping, buying, and selling unique items.',
  robots: 'index', 
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={inter.className}>
        {/* Providers component */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
