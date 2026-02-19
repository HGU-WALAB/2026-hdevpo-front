import type { PortfolioRepositoryItem } from '@/pages/summary/apis/portfolio';

export const mockPortfolioRepositories: PortfolioRepositoryItem[] = [
  {
    id: 1,
    repo_id: 101,
    custom_title: null,
    description: 'RESTful API 서버 구축 프로젝트',
    is_visible: true,
    display_order: 0,
  },
  {
    id: 2,
    repo_id: 102,
    custom_title: null,
    description: '관리자 대시보드 UI 프로젝트',
    is_visible: true,
    display_order: 1,
  },
];
