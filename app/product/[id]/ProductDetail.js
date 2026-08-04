'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Shield, Truck, RefreshCcw, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../../../lib/CartContext';
import { useAuth } from '../../../lib/CartContext';
import { api } from '../../../lib/api';
import ProductCard, { StarRating } from '../../../components/ProductCard';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function ProductDetail({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [localReviews, setLocalReviews] = useState(product.productReviews || []);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setReviewSubmitting(true);
    try {
      const review = await api.addReview(product.id, { rating: reviewRating, comment: reviewComment });
      setLocalReviews(prev => [...prev, review]);
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const images = product.images?.length ? product.images : [product.image];

  return (
    <main>
      <Navbar />
      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <Link href={`/shop?category=${product?.category}`} className="hover:text-primary transition-colors capitalize">{product?.category.replace('-', ' & ')}</Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium line-clamp-1">{product?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
              {product?.badge && (
                <span className="absolute top-4 left-4 z-10 bg-accent text-white text-sm font-bold px-3 py-1 rounded">{product?.badge}</span>
              )}
              <Image src={images[activeImage]} alt={product?.name} fill className="object-contain p-8" priority />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Image src={img} alt="" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold text-dark mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product?.rating} size={16} />
              <span className="text-sm text-gray-500">({product?.reviews} reviews)</span>
              <span className="text-sm text-green-600 font-medium">{product?.inStock ? '✓ In Stock' : '✗ Out of Stock'}</span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-accent">${product?.price}</span>
              {product?.originalPrice && <>
                <span className="text-gray-400 text-xl line-through">${product?.originalPrice}</span>
                <span className="bg-red-100 text-accent text-sm font-bold px-2 py-0.5 rounded">-{discount}%</span>
              </>}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product?.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-dark">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"><Minus size={16} /></button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"><Plus size={16} /></button>
              </div>
              <span className="text-xs text-gray-400">{product?.stock} available</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product?.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${addedToCart ? 'bg-green-600 text-white' : 'btn-primary'} disabled:opacity-50`}
              >
                {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>
              <Link href="/checkout" onClick={() => addToCart(product)} className="flex-1 bg-dark text-white py-3 rounded-xl font-semibold text-center hover:bg-gray-800 transition-colors">
                Buy Now
              </Link>
              <button className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <Heart size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid-cols-3 gap-3 mb-6 hidden">
              {[
                { icon: Truck, text: 'Free Shipping over $200' },
                { icon: RefreshCcw, text: '7-Day Easy Returns' },
                { icon: Shield, text: '1 Year Warranty' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center gap-1.5 bg-gray-50 rounded-xl p-3">
                  <Icon size={20} className="text-primary" />
                  <span className="text-xs text-gray-500">{text}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
              <Share2 size={15} /> Share this product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}>
                {tab} {tab === 'reviews' && `(${localReviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && product.specs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex gap-3 py-2.5 border-b border-gray-100">
                  <span className="text-sm font-semibold text-dark w-32 flex-shrink-0">{key}</span>
                  <span className="text-sm text-gray-600">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-2xl">
              {localReviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {localReviews.map(r => (
                    <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{r.userName?.charAt(0)}</div>
                        <span className="font-semibold text-sm">{r.userName}</span>
                        <StarRating rating={r.rating} size={12} />
                        <span className="text-xs text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-6">No reviews yet. Be the first to review!</p>
              )}

              {user ? (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-dark mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-dark mb-2 block">Your Rating</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <button key={i} type="button" onClick={() => setReviewRating(i)}>
                            <Star size={24} className={i <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 fill-gray-300'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-primary resize-none mb-4"
                      required
                    />
                    {reviewSuccess && <p className="text-green-600 text-sm mb-3">✓ Review submitted successfully!</p>}
                    <button type="submit" disabled={reviewSubmitting} className="btn-primary text-sm py-2.5 px-6">
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <p className="text-gray-500 text-sm mb-3">Please sign in to write a review</p>
                  <Link href="/account/login" className="btn-primary text-sm py-2 px-6">Sign In</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related products */}
        {product.related?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-dark mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
