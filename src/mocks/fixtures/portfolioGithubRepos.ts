import type { GitHubRepoItem } from '@/pages/summary/apis/portfolio';

export const mockGitHubRepos: GitHubRepoItem[] = [
  {
    repo_id: 100,
    name: 'portfolio-website',
    description: '개인 포트폴리오 웹사이트',
    created_at: '2024-01-15',
    updated_at: '2025-02-10',
    languages: ['TypeScript', 'React'],
  },
  {
    repo_id: 101,
    name: 'spring-boot-api',
    description: 'RESTful API 서버 구축 프로젝트',
    created_at: '2024-03-01',
    updated_at: '2025-01-20',
    languages: ['Java'],
  },
  {
    repo_id: 102,
    name: 'react-dashboard',
    description: '관리자 대시보드 UI 프로젝트',
    created_at: '2024-05-10',
    updated_at: '2025-02-05',
    languages: ['JavaScript'],
  },
  {
    repo_id: 103,
    name: 'machine-learning-study',
    description: '머신러닝 학습 프로젝트',
    created_at: '2024-02-20',
    updated_at: '2025-01-15',
    languages: ['Python'],
  },
  {
    repo_id: 104,
    name: 'mobile-app',
    description: '모바일 앱 개발 프로젝트',
    created_at: '2024-06-01',
    updated_at: '2025-02-01',
    languages: ['Kotlin'],
  },
  {
    repo_id: 105,
    name: 'algorithm-practice',
    description: '알고리즘 연습 저장소',
    created_at: '2024-04-12',
    updated_at: '2025-01-08',
    languages: ['C++'],
  },
];
