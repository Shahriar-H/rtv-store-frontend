import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getProduct(id) {
  try {
    const res = await fetch(`${BASE}/products/${id}`, { cache: 'no-store' });
   
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }) {
 
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: { title: product.name, description: product.description?.slice(0, 160), images: [{ url: product.image }] },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  return <ProductDetail product={product?.data} />;
}
