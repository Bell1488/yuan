import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import logoUrl from '../../assets/logo.png';

const contacts = [
  { icon: MessageCircle, label: 'Telegram', value: '@yuanpay', href: '#' },
  { icon: Mail, label: 'Email', value: 'support@yuanpay.pro', href: 'mailto:support@yuanpay.pro' },
  { icon: Phone, label: 'Телефон', value: '+7 915 884 86 23', href: 'tel:+79158848623' },
];

export default function Footer() {
  const { ref, visible } = useReveal();

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0a0f0d]">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-brand-600/8 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-brand-500/50" />
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Контакты</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl lg:text-5xl">
                Остались вопросы?
                <br />
                <span className="text-white/40">Напишите нам.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/40 sm:mt-5 sm:text-base">
                Калькулятор заявки находится в первом экране. Выберите услугу, получите расчёт и отправьте его менеджеру в Telegram.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:pt-8">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="group flex items-center gap-3 rounded-xl glass-dark p-4 transition-all duration-300 hover:border-white/15 sm:block">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:border-brand-400/30 group-hover:bg-brand-500/15">
                    <Icon className="h-5 w-5 text-brand-400" />
                  </div>
                  <div className="sm:mt-4">
                    <div className="text-[10px] text-white/30">{label}</div>
                    <div className="mt-0.5 text-sm font-semibold text-white/80">{value}</div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-brand-400 sm:mt-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:mt-16 sm:gap-5 sm:pt-7 sm:flex-row">
            <div className="flex items-center">
              <img src={logoUrl} alt="YuanPay" className="h-8 w-auto object-contain" />
            </div>
            <p className="text-center text-[11px] text-white/25 sm:text-right">© 2026 · Пополнение Alipay и WeChat · Выкуп с 1688 и Alibaba</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
