import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoUrl from '../../assets/logo.png';

const navLinks = [
  { label: 'О компании', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Калькулятор', href: '#hero-calculator' },
  { label: 'Как это работает', href: '#how-it-works' },
  { label: 'Вопросы', href: '#faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-3 sm:py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3 transition-all duration-500 ${
            scrolled ? 'glass-dark-strong' : 'border border-transparent'
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center" aria-label="На главную">
            <img src={logoUrl} alt="YuanPay" className="h-8 w-auto object-contain sm:h-9" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-brand-50 hover:shadow-lg hover:shadow-white/10"
            >
              Связаться
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 md:hidden"
            aria-label="Меню"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-2 glass-dark-strong rounded-2xl p-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900"
              >
                Связаться
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
