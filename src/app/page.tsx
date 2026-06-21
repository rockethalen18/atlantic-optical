import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturesStrip from '@/components/home/FeaturesStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ShippingBanner from '@/components/home/ShippingBanner';
import VideoSection from '@/components/home/VideoSection';
import Reviews from '@/components/home/Reviews';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <FeaturesStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <ShippingBanner />
      <VideoSection />
      <Reviews />
      <CTASection />
    </>
  );
}
