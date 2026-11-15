declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

const counterId = Number(import.meta.env.VITE_YANDEX_METRIKA_ID || 0);

export function initAnalytics() {
  if (!counterId || document.querySelector('script[data-yandex-metrika]')) return;

  const queue = (...args: unknown[]) => {
    (queue as typeof queue & { a?: unknown[][] }).a = (queue as typeof queue & { a?: unknown[][] }).a || [];
    (queue as typeof queue & { a?: unknown[][] }).a?.push(args);
  };
  window.ym = queue;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  script.dataset.yandexMetrika = 'true';
  document.head.appendChild(script);

  window.ym(counterId, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

export function trackGoal(goal: string, params?: Record<string, unknown>) {
  if (counterId && window.ym) window.ym(counterId, 'reachGoal', goal, params);
}

