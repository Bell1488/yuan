import { useReveal } from '../hooks/useReveal';

const stats = [
  { value: '₽ 480M+', label: 'Объём переводов за 2025', sub: 'More than 480 million rubles transferred' },
  { value: '5 000+', label: 'Активных клиентов в РФ', sub: 'Across all Russian regions' },
  { value: '15 мин', label: 'Среднее время пополнения', sub: 'From payment to wallet credit' },
  { value: '99.8%', label: 'Успешных операций', sub: 'Verified and completed transfers' },
];

export default function Stats() {
  const { ref, visible } = useReveal();

  return (
    <section className="relative border-y border-white/5 bg-[#0d1310]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div
          ref={ref}
          className={`reveal ${visible ? 'visible' : ''} grid grid-cols-2 gap-px bg-white/5 lg:grid-cols-4`}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[#0d1310] px-4 py-5 transition-colors duration-500 hover:bg-[#10171300] sm:px-6 sm:py-8"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-white/60 sm:mt-2 sm:text-sm">{stat.label}</div>
              <div className="mt-1 hidden text-xs text-white/30 sm:block">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
