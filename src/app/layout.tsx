import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/ui/CustomCursor';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import AuthModal from '@/components/ui/AuthModal';
import AIFragranceAssistant from '@/components/ui/AIFragranceAssistant';
import SmartSearch from '@/components/ui/SmartSearch';
import { ToastProvider } from '@/components/ui/Toast';
import ScrollToTop from '@/components/ui/ScrollToTop';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MAISON LUXE | Luxury Fragrance Collection',
  description:
    'Discover the world\'s finest luxury perfumes. Handcrafted fragrances from master perfumers. Experience artisanal scents that define elegance and sophistication.',
  keywords: [
    'luxury perfume',
    'designer fragrance',
    'niche perfume',
    'artisan fragrance',
    'premium scent',
    'luxury cologne',
    'designer perfume',
    'exclusive fragrance',
    'maison luxe',
    'perfume collection',
  ],
  openGraph: {
    title: 'MAISON LUXE | Luxury Fragrance Collection',
    description: 'Discover the world\'s finest luxury perfumes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-luxury-bg text-white font-body antialiased">
        <ToastProvider>
          <CustomCursor />
          <Navbar />
          <CartDrawer />
          <AuthModal />
          <SmartSearch />
          <AIFragranceAssistant />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
