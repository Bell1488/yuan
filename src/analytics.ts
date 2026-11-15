declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

const counterId = Number(import.meta.env.VITE_YANDEX_METRIKA_ID || 114267731);

export function initAnalytics() {
  // The counter is initialized by the official inline snippet in index.html.
}

export function trackGoal(goal: string, params?: Record<string, unknown>) {
  if (counterId && window.ym) window.ym(counterId, 'reachGoal', goal, params);
}

