import type { PortfolioRepositoryDuration } from '../apis/repositories';

/** ISO 날짜 문자열을 YYYY-MM-DD로 변환 */
export function formatDateOnly(iso: string): string {
  if (!iso || typeof iso !== 'string') return '';
  const s = iso.trim().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(iso.trim());
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** created_at, updated_at을 "YYYY-MM-DD ~ YYYY-MM-DD" 형식으로 */
export function formatDateRange(createdAt: string, updatedAt: string): string {
  const from = formatDateOnly(createdAt);
  const to = formatDateOnly(updatedAt);
  if (from && to) return `${from} ~ ${to}`;
  if (from) return from;
  if (to) return to;
  return '-';
}

function pickDurationIso(
  override: string | undefined,
  github: string | undefined,
  fallback: string,
): string {
  if (override != null && String(override).trim() !== '') {
    return String(override);
  }
  if (github != null && String(github).trim() !== '') {
    return String(github);
  }
  return fallback;
}

/** 표시·편집용 기간 ISO: override → GitHub 캐시 → 저장소 created/updated */
export function resolveRepositoryDurationIso(
  repo: {
    created_at: string;
    updated_at: string;
    duration?: PortfolioRepositoryDuration | null;
  },
  which: 'start' | 'end',
): string {
  const d = repo.duration;
  if (which === 'start') {
    return pickDurationIso(d?.started_at, d?.started_at_github, repo.created_at);
  }
  return pickDurationIso(d?.updated_at, d?.updated_at_github, repo.updated_at);
}

/**
 * 레포 카드: 사용자 표시 기간 override가 있으면 우선,
 * 없으면 duration의 GitHub 기준 시각, 최종 fallback은 created_at / updated_at.
 */
export function formatRepositoryDisplayDateRange(repo: {
  created_at: string;
  updated_at: string;
  duration?: PortfolioRepositoryDuration | null;
}): string {
  return formatDateRange(
    resolveRepositoryDurationIso(repo, 'start'),
    resolveRepositoryDurationIso(repo, 'end'),
  );
}

/** 포트폴리오 활동 기간: 종료일이 없으면 "YYYY-MM-DD ~ 현재" */
export function formatActivityPeriodRange(start: string, end: string): string {
  const from = formatDateOnly(start);
  const to = formatDateOnly(end);
  if (from && to) return `${from} ~ ${to}`;
  if (from) return `${from} ~ 현재`;
  if (to) return to;
  return '-';
}
