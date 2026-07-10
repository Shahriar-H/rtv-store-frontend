import Image from 'next/image';
import Link from 'next/link';
import imageRtv from '../assets/images-rtv.jpg';

export default function PromoBanner() {
  return (
    <section className="container py-6">
      {/* Big promo */}
      <div className="relative bg-dark rounded-2xl overflow-hidden mb-5 p-8 md:p-12 flex items-center">
        <div className="relative z-10 max-w-md">
          <p className="text-gray-400 text-sm mb-1">Best Seller</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            BEST IN <span className="text-primary">PRICE</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            find your any product with best price and best quality. we provide best product with best price.
          </p>
          <Link href="/shop" className="btn-primary">Buy Now →</Link>
        </div>
        <div className="absolute right-0 bottom-0 w-64 md:w-96 h-64 md:h-80 opacity-60 md:opacity-100">
          <Image
            src={imageRtv}
            alt="Image of a product"
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* Two mini promos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 hidden">
        <div className="promo-teal rounded-2xl p-6 flex items-center gap-4 overflow-hidden relative">
          <div className="flex-1">
            <p className="text-gray-500 text-xs mb-0.5">Foldable Motorised Treadmill</p>
            <h3 className="text-xl font-bold text-dark mb-1">Workout At Home</h3>
            <p className="text-primary font-semibold text-sm mb-4">Flat 20% off</p>
            <button className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary-dark transition-colors">
              Grab Now
            </button>
          </div>
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80" alt="Treadmill" fill className="object-contain" />
          </div>
        </div>

        <div className="promo-peach rounded-2xl p-6 flex items-center gap-4 overflow-hidden relative">
          <div className="flex-1">
            <p className="text-gray-500 text-xs mb-0.5">Apple Watch Ultra</p>
            <h3 className="text-xl font-bold text-dark mb-1">
              Up to <span className="text-accent">40% off</span>
            </h3>
            <p className="text-gray-500 text-xs mb-4">
              The aerospace-grade titanium case strikes the perfect balance of everything.
            </p>
            <button className="bg-accent text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
              Buy Now
            </button>
          </div>
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image src="https://images.unsplash.com/photo-1674158038702-6547b3b66f82?w=200&q=80" alt="Apple Watch Ultra" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
