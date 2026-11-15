import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
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
        <Stats />
        <About />
        <Services />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
