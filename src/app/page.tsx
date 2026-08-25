import HeroCarousel from '@/components/home/HeroCarousel';
import ScrollExpandSection from '@/components/home/ScrollExpandSection';
import FeaturesStrip from '@/components/home/FeaturesStrip';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import ApplicationShowcase from '@/components/home/ApplicationShowcase';
import StatsCounter from '@/components/home/StatsCounter';
import FeaturedProducts from '@/components/home/FeaturedProducts';
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
      <div className="gsap-reveal" data-gsap-direction="up" data-gsap-delay="0.1"><ApplicationShowcase /></div>
      <div className="gsap-reveal" data-gsap-direction="up" data-gsap-delay="0.15"><StatsCounter /></div>
      <div className="gsap-reveal" data-gsap-direction="scale"><FeaturedProducts /></div>
      <div className="gsap-reveal" data-gsap-direction="left"><VideoSection /></div>
      <div className="gsap-reveal" data-gsap-direction="right"><ProcessTimeline /></div>
      <ShippingBanner />
      <div className="gsap-reveal" data-gsap-direction="up"><TestimonialCards /></div>
      <CTASection />
    </>
  );
}
