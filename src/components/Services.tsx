import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import alipayLogo from '../../assets/alipay-icon-logo.png';
import wechatLogo from '../../assets/wechat-sign-logo.png';
import alibabaLogo from '../../assets/alibaba-group-horizontal-logo.png';

interface Service {
  title: string;
  description: string;
  features: string[];
  span: 'wide' | 'normal';
  accent: string;
  logo?: string;
}

const services: Service[] = [
  {
    title: 'Пополнение Alipay',
    description: 'Прямое пополнение кошелька Alipay в юанях. Перевод на любой аккаунт — от 100 ₽ до 500 000 ₽. Без посредников и скрытых комиссий.',
    features: ['Перевод за 15 минут', 'Комиссия от 3%', 'Поддержка 24/7', 'Любая сумма от 100 ₽'],
    span: 'wide',
    accent: 'from-brand-500/15 to-brand-700/5',
    logo: alipayLogo,
  },
  {
    title: 'WeChat Pay',
    description: 'Перевод на кошелёк WeChat для оплаты товаров и сервисов в Китае.',
    features: ['Мгновенный перевод', 'Без скрытых комиссий'],
    span: 'normal',
    accent: 'from-brand-400/12 to-brand-600/5',
    logo: wechatLogo,
  },
  {
    title: 'Выкуп с 1688',
    description: 'Выкуп товаров оптом с 1688.com — поиск, проверка, доставка в РФ.',
    features: ['Поиск поставщиков', 'Проверка качества', 'Доставка под ключ'],
    span: 'normal',
    accent: 'from-brand-500/12 to-brand-700/5',
  },
  {
    title: 'Выкуп с Alibaba',
    description: 'Закупка товаров на Alibaba для бизнеса. Полное сопровождение сделки: от поиска производителя до таможни и логистики. Работаем с юридическими лицами и ИП.',
    features: ['Оптовые заказы', 'Таможенное оформление', 'Логистика под ключ', 'Для юр. лиц и ИП'],
    span: 'wide',
    accent: 'from-brand-600/15 to-brand-800/5',
    logo: alibabaLogo,
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { ref, visible } = useReveal();
  const colSpan = service.span === 'wide' ? 'lg:col-span-3' : 'lg:col-span-2';
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} group relative overflow-hidden rounded-2xl glass-dark-strong p-5 sm:rounded-3xl sm:p-8 lg:p-10 transition-all duration-500 hover:border-white/15 ${colSpan}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Accent glow */}
      <div className={`pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br ${service.accent} blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100`} />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white p-2 transition-all duration-500 group-hover:border-brand-400/30 group-hover:bg-white">
            {service.logo ? (
              <img src={service.logo} alt="" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-sm font-black tracking-tight text-[#ff4f00]">1688</span>
            )}
          </div>
          <ArrowUpRight className="h-5 w-5 text-white/20 transition-all duration-500 group-hover:text-brand-400 group-hover:rotate-45" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-white sm:mt-6 sm:text-2xl">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/50 sm:mt-3">{service.description}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-5 sm:pt-6">
          {service.features.map((feature) => (
            <span
              key={feature}
              className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { ref, visible } = useReveal();

  return (
    <section id="services" className="relative scroll-mt-16 bg-[#0a0f0d] py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header — left aligned, editorial */}
        <div
          ref={ref}
          className={`reveal ${visible ? 'visible' : ''} max-w-2xl`}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-brand-500/50" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Услуги
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Полный цикл работы <br className="hidden sm:block" />
            <span className="text-white/40">с китайскими платёжами</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-5 lg:mt-14 lg:grid-cols-5">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
