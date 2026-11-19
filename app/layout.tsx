import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ConvertHub – Simple, private online tools',
  description: 'Convert, compress, and transform files in your browser. Free, fast, and private online tools.',
  openGraph: {
    title: 'ConvertHub – Simple, private online tools',
    description: 'Free browser-based file conversion tools. Your files stay on your device.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvertHub – Simple, private online tools',
    description: 'Free browser-based file conversion tools.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="min-h-screen flex flex-col justify-between antialiased text-stone-900">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
