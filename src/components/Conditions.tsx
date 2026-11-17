import { BadgeRussianRuble, FileCheck2, MessagesSquare, ShieldCheck } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const conditions = [
  {
    icon: BadgeRussianRuble,
    eyebrow: 'Минимальная сумма',
    title: 'От 5 000 ₽',
    description: 'Единый порог для пополнения, перевода поставщику и выкупа товара.',
  },
  {
    icon: FileCheck2,
    eyebrow: 'До перевода',
    title: 'Условия фиксируем заранее',
    description: 'Менеджер подтверждает курс, комиссию и итоговую сумму к получению.',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'Проверка',
    title: 'Сверяем реквизиты',
    description: 'Проверяем данные кошелька, заказа или поставщика перед оплатой.',
  },
  {
    icon: MessagesSquare,
    eyebrow: 'Сопровождение',
    title: 'Менеджер остаётся на связи',
    description: 'Подтверждаем операцию и сопровождаем заявку до завершения.',
  },
] as const;

export default function Conditions() {
  const { ref, visible } = useReveal();

  return (
    <section className="relative border-b border-white/8 bg-white/[0.035]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div
          ref={ref}
          className={`reveal ${visible ? 'visible' : ''} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}
        >
          {conditions.map(({ icon: Icon, eyebrow, title, description }, index) => (
            <div
              key={title}
              className="rounded-xl bg-[#16241c]/90 p-5 shadow-xl shadow-black/10 transition-colors duration-500 hover:bg-[#1b2d22]/90 sm:p-6"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-400/20 bg-brand-500/10">
                <Icon className="h-5 w-5 text-brand-400" />
              </div>
              <div className="mt-5 text-[10px] font-semibold uppercase text-brand-400">{eyebrow}</div>
              <h2 className="mt-1.5 text-lg font-bold text-white">{title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-white/45 sm:text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
