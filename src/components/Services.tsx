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
    description: 'Пополняем личные и корпоративные кошельки Alipay в юанях. До оплаты фиксируем курс, сумму к получению и комиссию.',
    features: ['От 5 000 ₽', 'Обычно от 15 минут', 'Курс до оплаты', 'Подтверждение перевода'],
    span: 'wide',
    accent: 'from-brand-500/15 to-brand-700/5',
    logo: alipayLogo,
  },
  {
    title: 'WeChat Pay',
    description: 'Переводим юани на WeChat Pay для оплаты товаров, сервисов и повседневных расходов в Китае.',
    features: ['От 5 000 ₽', 'Проверка реквизитов', 'Поддержка менеджера'],
    span: 'normal',
    accent: 'from-brand-400/12 to-brand-600/5',
    logo: wechatLogo,
  },
  {
    title: 'Выкуп с 1688',
    description: 'Помогаем оплатить заказ на 1688, связаться с продавцом и организовать отправку товара в Россию.',
    features: ['От 5 000 ₽', 'Проверка продавца', 'Оплата заказа', 'Доставка в РФ'],
    span: 'normal',
    accent: 'from-brand-500/12 to-brand-700/5',
  },
  {
    title: 'Выкуп с Alibaba',
    description: 'Сопровождаем закупку на Alibaba: согласуем инвойс, проводим оплату поставщику и помогаем с логистикой и документами.',
    features: ['От 5 000 ₽', 'Оптовые заказы', 'Для юрлиц и ИП', 'Логистика под ключ'],
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
    <section id="services" className="relative scroll-mt-16 py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.012] to-transparent" />

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
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            От разового пополнения кошелька до регулярных закупок для бизнеса. Минимальная сумма для любой услуги — 5 000 ₽, точные условия фиксируем до оплаты.
          </p>
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
