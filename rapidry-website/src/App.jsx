import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageLoader from './components/ui/PageLoader';
import ScrollProgress from './components/ui/ScrollProgress';
import Hero from './components/sections/Hero';
import StatsStrip from './components/sections/StatsStrip';
import PriceCalculator from './components/sections/PriceCalculator';
import HowItWorks from './components/sections/HowItWorks';
import Services from './components/sections/Services';
import CoverageMap from './components/sections/CoverageMap';
import Testimonials from './components/sections/Testimonials';
import AppDownload from './components/sections/AppDownload';
import Team from './components/sections/Team';
import WaitlistOffer from './components/sections/WaitlistOffer';
import FAQ from './components/sections/FAQ';
import { useLenis } from './hooks/useLenis';

function SectionDivider({ from, to }) {
  return <div aria-hidden="true" className={`h-10 w-full bg-gradient-to-b ${from} ${to}`} />;
}

export default function App() {
  useLenis();

  return (
    <>
      <PageLoader />
      <ScrollProgress />
      <Navbar />

      <main className="pt-[72px]">
        <section id="top">
          <Hero />
        </section>
        <SectionDivider from="from-forest-dark" to="to-cream" />
        <StatsStrip />
        <SectionDivider from="from-cream" to="to-forest-dark" />
        <PriceCalculator />
        <SectionDivider from="from-forest-dark" to="to-cream" />
        <HowItWorks />
        <Services />
        <CoverageMap />
        <SectionDivider from="from-cream" to="to-forest-dark" />
        <Testimonials />
        <SectionDivider from="from-forest-dark" to="to-cream" />
        <AppDownload />
        <SectionDivider from="from-cream" to="to-forest-dark" />
        <Team />
        <WaitlistOffer />
        <SectionDivider from="from-forest-dark" to="to-cream" />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
