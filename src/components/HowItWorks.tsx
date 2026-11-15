import { useReveal } from '../hooks/useReveal';
import { UserPlus, FileCheck, CreditCard, PackageCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
}

const steps: Step[] = [
  {
    icon: UserPlus,
    title: 'Заявка',
    description: 'Заполняете форму или пишете в мессенджер. Указываете сумму, платформу и реквизиты.',
    time: '1 мин',
  },
  {
    icon: FileCheck,
    title: 'Согласование',
    description: 'Менеджер подтверждает курс, комиссию и реквизиты. Фиксируем итоговую сумму.',
    time: '3 мин',
  },
  {
    icon: CreditCard,
    title: 'Оплата в рублях',
    description: 'Переводите рубли удобным способом — СБП, карта или банковский перевод.',
    time: '2 мин',
  },
  {
    icon: PackageCheck,
    title: 'Получение',
    description: 'Юани поступают на Alipay, WeChat или выкупаем товар с 1688 / Alibaba.',
    time: '15 мин',
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const { ref, visible } = useReveal();
  const Icon = step.icon;
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} relative`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="absolute top-8 left-full hidden w-full h-px bg-gradient-to-r from-brand-500/30 to-transparent lg:block" />
      )}

      <div className="glass-dark-strong rounded-2xl p-5 transition-all duration-500 hover:border-white/15 sm:p-6">
        {/* Number + time */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Icon className="h-5 w-5 text-brand-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/30">
              0{index + 1}
            </span>
            <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-400">
              {step.time}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white">{step.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-white/45 sm:text-sm">{step.description}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { ref, visible } = useReveal();

  return (
    <section id="how-it-works" className="relative scroll-mt-16 border-t border-white/5 bg-[#0d1310] py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 grid-pattern-dense opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={`reveal ${visible ? 'visible' : ''} max-w-2xl`}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-brand-500/50" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Процесс
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            От заявки до получения — <br className="hidden sm:block" />
            <span className="text-white/40">21 минута</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-5 lg:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
