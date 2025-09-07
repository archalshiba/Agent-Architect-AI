import HeaderUnauthenticated from '@/components/HeaderUnauthenticated';
import HeroSection from '@/components/HeroSection';
import FeatureShowcase from '@/components/FeatureShowcase';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <HeaderUnauthenticated />
      <main>
        <HeroSection />
        <FeatureShowcase />
      </main>
      <Footer />
    </>
  );
}