'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import NoImage from '../assets/no-image.png';

export function StarRating({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} size={size} className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />)}
    </div>
  );
}

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();
  const discount = product?.originalPrice ? Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100) : 0;

  if (layout === 'horizontal') {
    return (
      <Link href={`/product/${product?.slug}`} className="product-card flex gap-4 p-4 hover:shadow-md border !border-gray-300 rounded-lg transition-shadow">
        <div className="relative w-28 h-28 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          <Image src={product?.image || NoImage} alt={product?.name} fill className="object-contain p-2" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1"><StarRating rating={product?.rating} /><span className="text-xs text-gray-400">({product?.reviews})</span></div>
          <p className="font-medium text-dark text-sm mb-2 line-clamp-2">{product?.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">৳{product?.price}</span>
            {product?.originalPrice && <span className="text-gray-400 text-sm line-through">৳{product?.originalPrice}</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="product-card relative group">
      {(product.badge || discount > 0) && (
        <span className="absolute top-3 left-3 z-10 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
          {product.badge || `-${discount}%`}
        </span>
      )}
      <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
        <Heart size={15} />
      </button>
      <Link href={`/product/${product?.slug}`}>
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          <Image src={product?.image || NoImage} alt={product?.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>
      <button onClick={() => addToCart(product)} className="add-to-cart-overlay absolute bottom-0 left-0 right-0 bg-dark text-white py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors">
        <ShoppingCart size={16} /> Add to Cart
      </button>
      <Link href={`/product/${product?.slug}`} className="block p-4">
        <div className="flex items-center gap-1.5 mb-1.5"><StarRating rating={product?.rating} /><span className="text-xs text-gray-400">({product?.reviews})</span></div>
        <p className="font-medium text-dark text-sm mb-2 line-clamp-2 leading-snug">{product?.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold text-base">৳{product?.price}</span>
          {product?.originalPrice && <span className="text-gray-400 text-sm line-through">৳{product?.originalPrice}</span>}
        </div>
      </Link>
    </div>
  );
}
