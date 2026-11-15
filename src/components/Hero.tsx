import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeftRight, ArrowRight, Check, Clock, Shield, TrendingUp } from 'lucide-react';
import { trackGoal } from '../analytics';

const YUAN_RATE = 12.67;

const serviceTabs = [
  { id: 'alipay', label: 'Alipay', output: 'Пополнение кошелька' },
  { id: 'wechat', label: 'WeChat', output: 'Пополнение кошелька' },
  { id: '1688', label: '1688', output: 'Выкуп товара' },
  { id: 'taobao', label: 'Taobao', output: 'Выкуп товара' },
  { id: 'supplier', label: 'Поставщику', output: 'Перевод поставщику' },
] as const;

type ServiceId = (typeof serviceTabs)[number]['id'];

const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lead';
const TELEGRAM_USERNAME = String(import.meta.env.VITE_TELEGRAM_USERNAME || 'yuanpay').replace(/^@/, '');

export default function Hero() {
  const [time, setTime] = useState(new Date());
  const [service, setService] = useState<ServiceId>('alipay');
  const [amount, setAmount] = useState('50000');
  const [contact, setContact] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentService = serviceTabs.find((item) => item.id === service) ?? serviceTabs[0];
  const numericAmount = Number(amount) || 0;
  const received = numericAmount / YUAN_RATE;
  const formattedReceived = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(received);
  const timeStr = time.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const buildTelegramMessage = (kind: 'request' | 'estimate') => {
    const title = kind === 'estimate' ? 'Расчёт перевода YuanPay' : 'Заявка на перевод YuanPay';
    return [
      title,
      `Услуга: ${currentService.label} — ${currentService.output}`,
      `Сумма: ${numericAmount.toLocaleString('ru-RU')} ₽`,
      `Получатель: ${formattedReceived} CNY`,
      `Курс: 1 CNY = ${YUAN_RATE} ₽`,
      `Контакт: ${contact || 'уточнить в Telegram'}`,
    ].join('\n');
  };

  const openTelegramChat = (message: string) => {
    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sendToTelegram = async (kind: 'request' | 'estimate') => {
    setSending(true);
    setError('');
    openTelegramChat(buildTelegramMessage(kind));

    const query = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'].map((key) => [key, query.get(key) || '']),
    );

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          service: currentService.label,
          output: currentService.output,
          amount: numericAmount,
          received: formattedReceived,
          rate: YUAN_RATE,
          contact,
          pageUrl: window.location.href,
          referrer: document.referrer,
          utm,
        }),
      });

      if (!response.ok) throw new Error('lead_send_failed');
      trackGoal('lead_submit', { kind, service: currentService.label });
      window.dispatchEvent(new CustomEvent('yuanpay:lead-sent', { detail: { kind } }));
      if (kind === 'request') setSubmitted(true);
    } catch {
      setError('Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в Telegram.');
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent) return;
    void sendToTelegram('request');
  };

  const quickAmounts = [10000, 50000, 100000];

  return (
    <section className="relative min-h-screen max-w-full overflow-x-hidden bg-[#0a0f0d] noise">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-brand-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-500/8 blur-[100px]" />

      <div className="relative z-10 border-b border-white/5 bg-black/20 overflow-hidden">
        <div className="ticker-track flex w-max gap-10 py-2.5 whitespace-nowrap animate-[ticker_30s_linear_infinite]">
          {[...serviceTabs, ...serviceTabs].map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-3 text-xs">
              <span className="font-medium text-white/40">{item.label}</span>
              <span className="font-semibold text-white/80">{item.output}</span>
              <span className="text-brand-400">онлайн</span>
              <span className="text-white/10">|</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      <div className="relative z-10 mx-auto max-w-7xl min-w-0 px-4 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:pt-28">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full glass-dark px-3.5 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              <span className="text-[11px] font-medium text-white/70">Онлайн · курс обновлён в {timeStr}</span>
            </div>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Переводы в юанях —
              <br />
              <span className="text-white/45">быстро и без посредников.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/50 sm:text-base">
              Пополняем Alipay и WeChat, выкупаем товары с 1688 и Alibaba.
              Рассчитайте перевод за минуту и отправьте заявку в Telegram.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-5">
              {[
                { icon: Clock, value: '15 мин', label: 'до зачисления' },
                { icon: Shield, value: '5 000+', label: 'клиентов в РФ' },
                { icon: TrendingUp, value: '12.67 ₽', label: 'курс CNY' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={value} className="border-l border-white/10 pl-3 sm:pl-4">
                  <Icon className="mb-2 h-4 w-4 text-brand-400" />
                  <div className="text-sm font-bold text-white sm:text-base">{value}</div>
                  <div className="mt-0.5 text-[10px] text-white/35 sm:text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 max-w-full lg:pl-4">
            <form id="hero-calculator" onSubmit={handleSubmit} className="scroll-mt-24 w-full min-w-0 max-w-full glass-dark-strong rounded-2xl p-4 shadow-2xl shadow-black/30 sm:rounded-3xl sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-400/25 bg-brand-500/10 text-brand-400">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <h2 className="text-base font-bold text-white sm:text-lg">Рассчитать платёж</h2>
                </div>
                <span className="hidden rounded-md border border-brand-400/15 bg-brand-500/10 px-2 py-0.5 text-[9px] font-semibold text-brand-300 sm:block">КАЛЬКУЛЯТОР</span>
              </div>

              <div className="mt-4 flex gap-1 overflow-x-auto border-b border-white/8 scrollbar-hide">
                {serviceTabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setService(item.id)}
                    className={`whitespace-nowrap border-b-2 px-2.5 py-2 text-[11px] font-semibold transition-colors sm:px-4 sm:text-xs ${
                      service === item.id ? 'border-brand-400 text-brand-400' : 'border-transparent text-white/40 hover:text-white/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-3 sm:rounded-2xl sm:p-4">
                <label htmlFor="amount" className="text-[11px] font-medium text-white/40">Вы отправляете</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    id="amount"
                    type="number"
                    min="100"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="min-w-0 w-full bg-transparent text-xl font-bold tracking-tight text-white outline-none placeholder:text-white/20 sm:text-2xl"
                  />
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-white/70"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-brand-400">₽</span> RUB</span>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 py-1.5 text-[10px] text-white/35 sm:px-3">
                <span>1 CNY ≈ {YUAN_RATE.toFixed(2).replace('.', ',')} RUB</span>
                <button type="button" onClick={() => setAmount('')} className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-400" aria-label="Очистить сумму">
                  <ArrowLeftRight className="h-3 w-3" />
                </button>
              </div>

              <div className="rounded-xl border border-brand-400/20 bg-brand-500/10 p-3 sm:rounded-2xl sm:p-4">
                <div className="text-[11px] font-medium text-brand-200/60">Получатель получает · {currentService.output}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="min-w-0 w-full truncate text-xl font-bold tracking-tight text-white sm:text-2xl">{formattedReceived}</div>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-white/70"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-400/20 bg-brand-500/10 text-sm text-brand-300">¥</span> CNY</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 px-1">
                {quickAmounts.map((quickAmount) => (
                  <button key={quickAmount} type="button" onClick={() => setAmount(String(quickAmount))} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-white/45 transition-colors hover:border-brand-400/30 hover:text-brand-400">
                    {quickAmount.toLocaleString('ru-RU')} ₽
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <label htmlFor="contact" className="text-[11px] font-medium text-white/45">Куда написать вам?</label>
                <input id="contact" type="text" required value={contact} onChange={(event) => setContact(event.target.value)} placeholder="@username или +7 999 123-45-67" className="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25" />
              </div>

              <label className="mt-2.5 flex cursor-pointer items-start gap-2 text-[9px] leading-relaxed text-white/40">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#205d46]" />
                <span>Даю согласие на обработку данных для связи по заявке. <a href="/privacy.html" target="_blank" rel="noreferrer" className="text-brand-300 underline underline-offset-2">Политика конфиденциальности</a>.</span>
              </label>

              <button type="submit" disabled={!consent || submitted || sending} className="mt-3 flex w-full items-center justify-between rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/15 transition-all hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5">
                <span>{submitted ? 'Заявка отправлена' : sending ? 'Отправляем…' : 'Оставить заявку'}</span>
                {submitted ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>

              <button type="button" disabled={!consent || sending} onClick={() => void sendToTelegram('estimate')} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-400/20 bg-brand-500/10 px-4 py-2.5 text-[13px] font-semibold text-brand-300 transition-colors hover:bg-brand-500/15 disabled:cursor-not-allowed disabled:opacity-50">
                <span className="text-sm">↗</span>
                Получить расчёт в Telegram
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              {error && <p role="alert" className="mt-2 text-center text-[10px] text-red-300">{error}</p>}

              <p className="mt-2.5 text-center text-[9px] text-white/30">Без оплаты на сайте. Итоговый курс и условия согласуем до перевода.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
