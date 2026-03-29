import { palette } from '@/styles/palette';

/** GET/PUT API `level` (0~100) */
export function clampTechLevel(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export type TechLevelBand = 'beginner' | 'average' | 'expert';

export function getTechLevelBand(level: number): TechLevelBand {
  const l = clampTechLevel(level);
  if (l <= 30) return 'beginner';
  if (l <= 70) return 'average';
  return 'expert';
}

export function getTechLevelBandLabel(band: TechLevelBand): string {
  switch (band) {
    case 'beginner':
      return '초보';
    case 'average':
      return '평균';
    case 'expert':
      return '전문가';
    default:
      return '';
  }
}

/** 가이드·슬라이더 미리보기용 (palette) */
export function getTechLevelStyle(band: TechLevelBand): {
  tagBg: string;
  tagBorder: string;
  tagColor: string;
  barFill: string;
} {
  switch (band) {
    case 'beginner':
      return {
        tagBg: palette.grey100,
        tagBorder: palette.grey300,
        tagColor: palette.grey600,
        barFill: palette.grey500,
      };
    case 'average':
      return {
        tagBg: palette.blue300,
        tagBorder: palette.blue400,
        tagColor: palette.blue600,
        barFill: palette.blue500,
      };
    case 'expert':
      return {
        tagBg: palette.green300,
        tagBorder: palette.green500,
        tagColor: palette.green600,
        barFill: palette.green500,
      };
    default:
      return {
        tagBg: palette.grey100,
        tagBorder: palette.grey200,
        tagColor: palette.grey600,
        barFill: palette.grey500,
      };
  }
}

/**
 * 숙련도 6구간 (낮은 % → 높은 %): 회색 → 노랑 → 파랑 → 초록 → 보라 → 빨강
 * 태그: 연한 배경 + 진한 테두리·글자색
 */
export const LEVEL_TIER_RANGE_LABELS = [
  '0~16%',
  '17~33%',
  '34~50%',
  '51~67%',
  '68~84%',
  '85~100%',
] as const;

const LEVEL_TIER_PALETTE: { bg: string; fg: string; border: string }[] = [
  { bg: '#ECEFF1', fg: '#37474F', border: '#546E7A' },
  { bg: '#FFFDE7', fg: '#9E6B00', border: '#F9A825' },
  { bg: '#E3F2FD', fg: '#0D47A1', border: '#1565C0' },
  { bg: '#E8F5E9', fg: '#1B5E20', border: '#2E7D32' },
  { bg: '#EDE7F6', fg: '#4527A0', border: '#5E35B1' },
  { bg: '#FFEBEE', fg: '#B71C1C', border: '#C62828' },
];

/** 0~5, `level`이 속한 구간 인덱스 */
export function getLevelTierIndex(level: number): number {
  const l = clampTechLevel(level);
  if (l <= 16) return 0;
  if (l <= 33) return 1;
  if (l <= 50) return 2;
  if (l <= 67) return 3;
  if (l <= 84) return 4;
  return 5;
}

/** API level(0~100) → 표·모달용 5단계 (칼럼 인덱스 0~4) */
export type ProficiencyTierIndex = 0 | 1 | 2 | 3 | 4;

export const PROFICIENCY_TIER_LABELS = [
  'Beginner',
  'Basic',
  'Intermediate',
  'Advanced',
  'Expert',
] as const;

export function levelToProficiencyTier(level: number): ProficiencyTierIndex {
  const l = clampTechLevel(level);
  if (l <= 19) return 0;
  if (l <= 39) return 1;
  if (l <= 59) return 2;
  if (l <= 79) return 3;
  return 4;
}

/** 단계 선택 시 API에 저장할 대표 level (구간 중앙값) */
export function tierToRepresentativeLevel(tier: ProficiencyTierIndex): number {
  return ([10, 30, 50, 70, 90] as const)[tier];
}

/**
 * 5단계 칼럼용 태그 색 (표·모달·범례 공통).
 * Advanced는 보라 대신 초록 톤으로 통일.
 */
const PROFICIENCY_TIER_TAG_PAIRS: { bg: string; fg: string; border: string }[] =
  [
    { bg: '#ECEFF1', fg: '#37474F', border: '#546E7A' },
    { bg: '#FFFDE7', fg: '#9E6B00', border: '#F9A825' },
    { bg: '#E3F2FD', fg: '#0D47A1', border: '#1565C0' },
    { bg: '#E8F5E9', fg: '#1B5E20', border: '#2E7D32' },
    { bg: '#FFEBEE', fg: '#B71C1C', border: '#C62828' },
  ];

export function getProficiencyTierTagPair(tier: ProficiencyTierIndex): {
  bg: string;
  fg: string;
  border: string;
} {
  return PROFICIENCY_TIER_TAG_PAIRS[tier];
}

/** 전체 도메인에서 실제로 데이터가 있는 숙련도 단계만 (칼럼 표시용) */
export function collectVisibleProficiencyTiers(
  domains: { tech_stacks: { level: number }[] }[],
): ProficiencyTierIndex[] {
  const set = new Set<number>();
  for (const d of domains) {
    for (const t of d.tech_stacks ?? []) {
      set.add(levelToProficiencyTier(t.level));
    }
  }
  return Array.from(set).sort((a, b) => a - b) as ProficiencyTierIndex[];
}

/** 5단계 범례 (칼럼별 태그 색과 동일) */
export function getProficiencyTierLegend(): {
  label: string;
  bg: string;
  fg: string;
  border: string;
}[] {
  return PROFICIENCY_TIER_LABELS.map((label, i) => ({
    label,
    ...getProficiencyTierTagPair(i as ProficiencyTierIndex),
  }));
}

/** 태그 배경·글자색·테두리 (숙련도 % 구간별) */
export function getLevelTagPair(level: number): {
  bg: string;
  fg: string;
  border: string;
} {
  return LEVEL_TIER_PALETTE[getLevelTierIndex(level)];
}

/** 범례(동그라미 + 구간)용 */
export function getLevelTierLegend(): {
  rangeLabel: string;
  bg: string;
  fg: string;
  border: string;
}[] {
  return LEVEL_TIER_RANGE_LABELS.map((rangeLabel, i) => ({
    rangeLabel,
    bg: LEVEL_TIER_PALETTE[i].bg,
    fg: LEVEL_TIER_PALETTE[i].fg,
    border: LEVEL_TIER_PALETTE[i].border,
  }));
}
