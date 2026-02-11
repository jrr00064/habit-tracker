export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

export function getDaysBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.abs(Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export function isSameDay(d1: string, d2: string): boolean {
  return d1 === d2;
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

export function getDayName(dateStr: string, locale: string = 'es-ES'): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString(locale, { weekday: 'short' });
}

export function formatDateDisplay(dateStr: string, locale: string = 'es-ES'): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString(locale, { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
  });
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getDatesForHeatmap(weeks: number = 12): string[] {
  const dates: string[] = [];
  const totalDays = weeks * 7;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - (endDate.getDay() || 7) + 7);
  
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  
  return dates;
}
