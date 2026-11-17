import { Building2, CalendarDays, Check, FileText, MapPin, ShieldCheck } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const companyDetails = [
  { icon: Building2, label: 'Наименование', value: 'ООО «УНИ ЛАЙН»' },
  { icon: ShieldCheck, label: 'Статус', value: 'Действующая компания' },
  { icon: CalendarDays, label: 'Дата регистрации', value: '24 марта 2026 года' },
  { icon: FileText, label: 'ОГРН', value: '1267700101811' },
  { icon: FileText, label: 'ИНН / КПП', value: '7708459475 / 770801001' },
  { icon: FileText, label: 'Вид деятельности', value: 'Деятельность по упаковыванию товаров (82.92) и ещё 5 видов деятельности' },
  { icon: MapPin, label: 'Юридический адрес', value: '107140, г. Москва, вн. тер. г. муниципальный округ Красносельский, пер. 3-й Красносельский, д. 19, стр. 4, помещ. 56Н/5' },
];

export default function About() {
  const { ref, visible } = useReveal();

  return (
    <section id="about" className="relative scroll-mt-16 py-16 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''} grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20`}>
          <div>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-brand-500/50" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">О компании</span>
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Работаем прозрачно
              <br />
              <span className="text-white/40">и официально.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45 sm:text-base">
              YuanPay — сервис переводов и сопровождения платежей для работы с китайскими платформами.
              Ниже указаны регистрационные данные оператора сервиса.
            </p>
            <div className="mt-7 space-y-3 text-sm text-white/65">
              {['Проверяем реквизиты перед переводом', 'Согласуем курс и комиссию заранее', 'Сопровождаем операцию до получения'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-400/20 bg-brand-500/10">
                    <Check className="h-3.5 w-3.5 text-brand-400" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <dl className="grid gap-x-8 gap-y-5 rounded-2xl border border-white/8 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 sm:grid-cols-2 sm:p-7">
            {companyDetails.map(({ icon: Icon, label, value }) => (
              <div key={label} className="border-b border-white/8 pb-4 last:sm:col-span-2">
                <dt className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/35">
                  <Icon className="h-3.5 w-3.5 text-brand-400" />
                  {label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

