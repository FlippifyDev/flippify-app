import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { Metadata } from 'next'


const inter = Inter({ subsets: ['latin'] });

 
export const metadata: Metadata = {
  title: 'Flippify',
  description: 'Flippify - Your ultimate platform for flipping, buying, and selling unique items. Join our community to discover great deals, rare finds, and a seamless trading experience. Start flipping today!'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={inter.className}>
        <Providers>
            {children}  
        </Providers>
      </body>
    </html>
  )
}
