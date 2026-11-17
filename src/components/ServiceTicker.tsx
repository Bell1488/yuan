const tickerItems = [
  { label: 'Alipay', detail: 'Пополнение кошелька' },
  { label: 'WeChat Pay', detail: 'Перевод в юанях' },
  { label: '1688', detail: 'Выкуп товара' },
  { label: 'Taobao', detail: 'Оплата заказа' },
  { label: 'Поставщику', detail: 'Перевод по реквизитам' },
] as const;

export default function ServiceTicker() {
  return (
    <div className="relative overflow-hidden border-y border-white/8 bg-[#101b15]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#101b15] to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#101b15] to-transparent sm:w-28" />
      <div className="ticker-track flex w-max gap-10 py-3.5 whitespace-nowrap animate-[ticker_30s_linear_infinite] sm:py-4">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="font-semibold text-white/85">{item.label}</span>
            <span className="text-white/45">{item.detail}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
