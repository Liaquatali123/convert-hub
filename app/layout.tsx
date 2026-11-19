import type {Metadata} from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ConvertHub – Premium Online Converters',
  description: 'Convert, compress, and transform files directly in your browser. Fast, private client-side tools with a premium experience.',
  openGraph: {
    title: 'ConvertHub – Premium Online Converters',
    description: 'Fast, private client-side file conversion tools.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvertHub – Premium Online Converters',
    description: 'Fast, private client-side file conversion tools.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body suppressHydrationWarning className="min-h-screen text-gray-50 flex flex-col justify-between antialiased">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
