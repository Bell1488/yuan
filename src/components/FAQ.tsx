import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const faqs = [
  {
    question: 'Сколько времени занимает пополнение Alipay или WeChat?',
    answer: 'Обычно перевод поступает в течение 15–30 минут после оплаты. В редких случаях — до 2 часов (ночные часы, технические работы платформы).',
  },
  {
    question: 'Какой курс юаня вы используете?',
    answer: 'Текущий курс — 1 CNY = 12.67 ₽. Курс обновляется регулярно. Итоговый курс фиксируется на момент согласования заявки с менеджером.',
  },
  {
    question: 'Какие способы оплаты вы принимаете?',
    answer: 'Оплата рублями через СБП, банковскую карту и банковский перевод. Для юридических лиц доступен безналичный расчёт с закрывающими документами.',
  },
  {
    question: 'Можно ли выкупить товар с 1688 или Alibaba?',
    answer: 'Да. Мы предоставляем услугу выкупа с 1688.com и Alibaba.com — поиск поставщика, проверка качества, оформление заказа, доставка в Россию под ключ.',
  },
  {
    question: 'Есть ли минимальная сумма?',
    answer: 'Да, минимальная сумма для пополнения Alipay и WeChat, перевода поставщику или выкупа товара — 5 000 ₽.',
  },
  {
    question: 'Это безопасно?',
    answer: 'Мы работаем официально, предоставляем чеки и гарантии на каждую операцию. Все сделки подтверждаются в чате с менеджером. Возврат при ошибке перевода.',
  },
];

function FaqItem({ question, answer, index, visible }: { question: string; answer: string; index: number; visible: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`reveal ${visible ? 'visible' : ''} border-b border-white/8 transition-colors duration-300 ${
        open ? 'bg-white/[0.02]' : ''
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:gap-6 sm:px-6 sm:py-6"
      >
        <span className={`text-sm font-semibold sm:text-base transition-colors duration-300 ${open ? 'text-white' : 'text-white/70'}`}>
          {question}
        </span>
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
          open ? 'border-brand-400/30 bg-brand-500/15' : 'border-white/10 bg-white/5'
        }`}>
          {open ? <Minus className="h-4 w-4 text-brand-400" /> : <Plus className="h-4 w-4 text-white/50" />}
        </div>
      </button>
      <div
        className={`grid transition-all duration-400 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-relaxed text-white/45 max-w-3xl">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { ref, visible } = useReveal();

  return (
    <section id="faq" className="relative scroll-mt-16 border-t border-white/8 bg-white/[0.03] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Left: header */}
          <div
            ref={ref}
            className={`reveal ${visible ? 'visible' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-brand-500/50" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Вопросы
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl text-balance">
              Частые вопросы
            </h2>
            <p className="mt-3 text-sm text-white/40 sm:mt-4 sm:text-base">
              Не нашли ответ? Напишите нам — ответим за 10 минут.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 transition-all hover:border-white/20 hover:bg-white/5 sm:mt-6 sm:px-5 sm:py-3"
            >
              Задать вопрос
            </a>
          </div>

          {/* Right: FAQ items */}
          <div className={`reveal ${visible ? 'visible' : ''} rounded-2xl glass-dark overflow-hidden`} style={{ transitionDelay: '120ms' }}>
            {faqs.map((faq, i) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={i} visible={visible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
