import './globals.css';
import { AppProviders } from '../lib/CartContext';
import NextTopLoader from 'nextjs-toploader';


export const metadata = {
  title: { default: 'Robo Tech Valley – Best Tech Store in Bangladesh', template: '%s | Robo Tech Valley' },
  description: 'Shop the latest electronics, smartphones, laptops, and gadgets at unbeatable prices. bKash & COD accepted.',
  keywords: ['electronics', 'tech store', 'smartphones', 'laptops', 'bKash', 'Bangladesh', 'online shopping'],
  openGraph: {
    title: 'Robo Tech Valley – Best Tech Store',
    description: 'Shop the latest electronics at unbeatable prices.',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: './fav.png',
    shortcut: './fav.png',
    apple: './fav.png',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body>
        <AppProviders>
          
          <NextTopLoader color="blue" />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
