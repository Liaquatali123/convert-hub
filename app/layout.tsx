import type {Metadata} from 'next';
import './globals.css'; // Global styles
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ConvertHub – Free Online Converters — Fast, Simple & Private',
  description: 'Convert, compress, and transform your files directly in your browser. Fast, 100% private client-side converters for image, PDF, data, and text without server uploads.',
  openGraph: {
    title: 'ConvertHub – Free Online Converters — Fast, Simple & Private',
    description: 'Convert, compress, and transform your files directly in your browser. Fast, 100% private client-side converters for image, PDF, data, and text without server uploads.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvertHub – Free Online Converters — Fast, Simple & Private',
    description: 'Convert, compress, and transform your files directly in your browser. Fast, 100% private client-side converters for image, PDF, data, and text without server uploads.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="min-h-screen bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-50 flex flex-col justify-between transition-colors antialiased">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

