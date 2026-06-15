import { Suspense } from 'react';
import ShopClient from './ShopClient';

export const metadata = {
  title: 'Shop — Browse All Products',
  description:
    'Explore our full range of electronics, laptops, smartphones, gaming gear and more.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopClient />
    </Suspense>
  );
}