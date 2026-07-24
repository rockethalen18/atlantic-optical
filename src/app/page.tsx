import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturesStrip from '@/components/home/FeaturesStrip';
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
      <div className="gsap-reveal" data-gsap-direction="up"><FeaturedProducts /></div>
      <ShippingBanner />
      <div className="gsap-reveal" data-gsap-direction="up"><VideoSection /></div>
      <div className="gsap-reveal" data-gsap-direction="up" data-gsap-delay="0.1"><Reviews /></div>
      <CTASection />
    </>
  );
}
