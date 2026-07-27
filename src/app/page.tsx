import HeroCarousel from '@/components/home/HeroCarousel';
import ScrollExpandSection from '@/components/home/ScrollExpandSection';
import FeaturesStrip from '@/components/home/FeaturesStrip';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import StatsCounter from '@/components/home/StatsCounter';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandMarquee from '@/components/home/BrandMarquee';
import ParallaxBanner from '@/components/home/ParallaxBanner';
import VideoSection from '@/components/home/VideoSection';
import ProcessTimeline from '@/components/home/ProcessTimeline';
import ShippingBanner from '@/components/home/ShippingBanner';
import TestimonialCards from '@/components/home/TestimonialCards';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <ScrollExpandSection />
      <FeaturesStrip />
      <div className="gsap-reveal" data-gsap-direction="up"><CategoryShowcase /></div>
      <div className="gsap-reveal" data-gsap-direction="up" data-gsap-delay="0.1"><StatsCounter /></div>
      <div className="gsap-reveal" data-gsap-direction="scale"><FeaturedProducts /></div>
      <BrandMarquee />
      <div className="gsap-reveal" data-gsap-direction="up"><ParallaxBanner /></div>
      <div className="gsap-reveal" data-gsap-direction="left"><VideoSection /></div>
      <div className="gsap-reveal" data-gsap-direction="right"><ProcessTimeline /></div>
      <ShippingBanner />
      <div className="gsap-reveal" data-gsap-direction="up"><TestimonialCards /></div>
      <CTASection />
    </>
  );
}
