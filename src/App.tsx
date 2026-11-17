import Header from './components/Header';
import Hero from './components/Hero';
import ServiceTicker from './components/ServiceTicker';
import Conditions from './components/Conditions';
import About from './components/About';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <Header />
      <main>
        <Hero />
        <ServiceTicker />
        <div className="ambient-surface relative isolate overflow-hidden">
          <Conditions />
          <Services />
          <HowItWorks />
          <About />
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
}
