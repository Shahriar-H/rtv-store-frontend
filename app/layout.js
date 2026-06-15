import './globals.css';
import { AppProviders } from '../lib/CartContext';

export const metadata = {
  title: { default: 'Robo Tech Valley – Best Tech Store in Bangladesh', template: '%s | Robo Tech Valley' },
  description: 'Shop the latest electronics, smartphones, laptops, and gadgets at unbeatable prices. Free shipping over $200. bKash & COD accepted.',
  keywords: ['electronics', 'tech store', 'smartphones', 'laptops', 'bKash', 'Bangladesh', 'online shopping'],
  openGraph: {
    title: 'Robo Tech Valley – Best Tech Store',
    description: 'Shop the latest electronics at unbeatable prices.',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
