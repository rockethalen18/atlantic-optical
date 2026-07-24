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
      <div className="gsap-reveal" data-gsap-direction="up"><FeaturesStrip /></div>
      <div className="gsap-reveal" data-gsap-direction="up" data-gsap-delay="0.1"><FeaturedProducts /></div>
      <div className="gsap-reveal" data-gsap-direction="left"><ShippingBanner /></div>
      <div className="gsap-reveal" data-gsap-direction="scale" data-gsap-duration="1.2"><VideoSection /></div>
      <div className="gsap-reveal" data-gsap-direction="up" data-gsap-delay="0.15"><Reviews /></div>
      <div className="gsap-reveal" data-gsap-direction="up" data-gsap-duration="1.1"><CTASection /></div>
    </>
  );
}
