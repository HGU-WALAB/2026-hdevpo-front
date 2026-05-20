import type { ActivityApiItem } from '@/pages/portfolio/apis/portfolio';

/** display_order 0이 맨 위. category는 사용자 정의 문자열 */
export const mockActivitiesResponse: ActivityApiItem[] = [
  {
    id: 1,
    title: '교내 해커톤 대상',
    description: '팀 프로젝트 기획·백엔드 개발',
    host: '소프트웨어 중심대학',
    role: '백엔드 리드, API 설계 및 구현',
    achievements: '교내 해커톤 대상 수상',
    achievements_detail: '48시간 내 MVP 완성 및 심사위원 피드백 반영',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    category: '수상',
    display_order: 0,
    url: 'https://example.com/hackathon',
    tags: ['해커톤', '백엔드'],
  },
  {
    id: 2,
    title: '오픈소스 기여',
    description: '문서 번역 및 이슈 트리아지',
    host: '오픈소스 커뮤니티',
    role: '문서 번역, PR 리뷰 보조',
    achievements: 'Merged PR 12건',
    achievements_detail: '',
    start_date: '2024-03-01',
    end_date: '2024-12-31',
    category: '대외활동',
    display_order: 1,
    url: '',
    tags: ['오픈소스', '문서'],
  },
];
