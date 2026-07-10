import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import FeatureBar from '../components/FeatureBar';
import CategoryBrowser from '../components/CategoryBrowser';
import NewArrivals from '../components/NewArrivals';
import PromoBanner from '../components/PromoBanner';
import BestSellers from '../components/BestSellers';
import CountdownDeal from '../components/CountdownDeal';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Robo Tech Valley — Best Tech Store in Bangladesh',
  description: 'Shop the latest electronics, smartphones, laptops, and gadgets at unbeatable prices. bKash & COD accepted.',
};

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroBanner />
      <FeatureBar />
      <CategoryBrowser />
      <NewArrivals />
      <PromoBanner />
      <BestSellers />
      <CountdownDeal />
      {/* <Testimonials />
      <Newsletter /> */}
      <Footer />
    </main>
  );
}
