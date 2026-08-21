import { Suspense } from 'react';
import SaleClient from './SaleClient';

export const metadata = {
  title: 'Sale — Hot Deals & Discounts',
  description: 'Grab the best deals on electronics, robotics gear, and gadgets at discounted prices.',
};

export default function SalePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SaleClient />
    </Suspense>
  );
}
