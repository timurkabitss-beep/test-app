import { Match, Score } from './types';

export type Filter = 'all' | 'upcoming' | 'finished';

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Запланирован',
  live: 'Идёт',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

export function getStatusLabel(match: Match): string {
  if (match.status === 'live' && match.minute != null) {
    return `Идёт, ${match.minute}′`;
  }
  // неизвестный статус не должен ломать экран
  return STATUS_LABELS[match.status] ?? 'Статус неизвестен';
}

export function formatStart(startsAt: string | null): string {
  if (!startsAt) return 'Дата уточняется';
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return 'Дата уточняется';
  // без параметра timeZone берётся часовой пояс устройства
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatScore(score: Score | null): string {
  // 0:0 это валидный счёт, поэтому сравниваем с null, а не проверяем «правдивость»
  return score ? `${score.home} : ${score.away}` : '–';
}

export function filterMatches(matches: Match[], filter: Filter): Match[] {
  if (filter === 'finished') {
    return matches.filter((m) => m.status === 'finished');
  }
  if (filter === 'upcoming') {
    return matches.filter(
      (m) =>
        m.status === 'scheduled' ||
        m.status === 'live' ||
        m.status === 'postponed',
    );
  }
  return matches; // «Все»: включая матчи с неизвестным статусом
}