import type { TechStackDomain } from '../apis/portfolio';
import { clampTechLevel } from './techStackLevel';

/** 클라이언트 전용 임시 도메인 id (서버 id 미부여 시 음수) */
export function nextTempDomainId(domains: TechStackDomain[]): number {
  let min = 0;
  for (const d of domains) {
    if (d.id != null && d.id < min) min = d.id;
  }
  if (min === 0) return -1;
  return min - 1;
}

/** GET 직후 캐시용: 빈 이름·기술 제거, order_index 정렬, id 없으면 임시 id 부여 */
export function normalizeTechStackDomainsFromResponse(
  domains: TechStackDomain[] | undefined,
): TechStackDomain[] {
  const raw = [...(domains ?? [])]
    .map((d, i) => ({
      id: d.id,
      name: (d.name ?? '').trim(),
      order_index: typeof d.order_index === 'number' ? d.order_index : i,
      tech_stacks: (d.tech_stacks ?? [])
        .map(t => ({
          name: (t.name ?? '').trim(),
          level: clampTechLevel(t.level ?? 0),
        }))
        .filter(t => t.name !== ''),
    }))
    .filter(d => d.name !== '');
  raw.sort((a, b) => a.order_index - b.order_index);
  let fallback = -1;
  return raw.map((d, i) => ({
    ...d,
    id: d.id != null ? d.id : fallback--,
    order_index: i,
  }));
}

/** PUT 요청 본문: 양수 id만 유지, order_index 재부여 */
export function normalizeTechStackDomainsForPersist(
  domains: TechStackDomain[],
): TechStackDomain[] {
  return domains
    .map(d => ({
      id: d.id != null && d.id > 0 ? d.id : undefined,
      name: (d.name ?? '').trim(),
      order_index: d.order_index,
      tech_stacks: (d.tech_stacks ?? [])
        .map(t => ({
          name: (t.name ?? '').trim(),
          level: clampTechLevel(t.level ?? 0),
        }))
        .filter(t => t.name !== ''),
    }))
    .filter(d => d.name !== '')
    .map((d, i) => ({ ...d, order_index: i }));
}
