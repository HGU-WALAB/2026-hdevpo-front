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

/**
 * 레포 카드: 사용자 표시 기간 override가 있으면 우선,
 * 없으면 GitHub 저장소 created_at / updated_at 기준.
 */
export function formatRepositoryDisplayDateRange(repo: {
  created_at: string;
  updated_at: string;
  duration?: { started_at?: string; updated_at?: string } | null;
}): string {
  const d = repo.duration;
  const start =
    d?.started_at != null && String(d.started_at).trim() !== ''
      ? String(d.started_at)
      : repo.created_at;
  const end =
    d?.updated_at != null && String(d.updated_at).trim() !== ''
      ? String(d.updated_at)
      : repo.updated_at;
  return formatDateRange(start, end);
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
