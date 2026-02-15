/**
 * 섹션 순서 키. 추후 PUT /api/portfolio/settings 의 section_order 와 연동 예정.
 * user_info 는 상단 고정이라 드래그 대상에서 제외.
 */
export type SectionOrderKey =
  | 'user_info'
  | 'tech_stack'
  | 'repo'
  | 'mileage'
  | 'activities';

/** 드래그 대상 섹션 (user_info 제외) */
export type DraggableSectionKey = Exclude<SectionOrderKey, 'user_info'>;

/** 드래그로 순서 변경 가능한 섹션 (user_info 제외) */
export const DRAGGABLE_SECTION_ORDER: DraggableSectionKey[] = [
  'tech_stack',
  'repo',
  'mileage',
  'activities',
];

export const SECTION_TITLES: Record<SectionOrderKey, string> = {
  user_info: '유저정보',
  tech_stack: '기술 스택',
  repo: '깃허브 레포지토리',
  mileage: '마일리지 정보',
  activities: '활동',
};
