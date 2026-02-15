import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  DRAGGABLE_SECTION_ORDER,
  type DraggableSectionKey,
} from '../../constants/constants';

export interface RepoItem {
  repo_id: number;
  custom_title: string | null;
  is_visible: boolean;
  name: string;
  owner?: string;
  description: string;
  created_at: string;
  updated_at: string;
  languages: string[];
}

export interface MileageItem {
  mileage_id: number;
  semester: string;
  category: string;
  item: string;
  additional_info: string;
  is_visible: boolean;
}

export interface ActivityItem {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

const INITIAL_REPOS: RepoItem[] = [
  {
    repo_id: 1,
    name: 'web-camp-2026',
    owner: 'lyh',
    custom_title: null,
    is_visible: false,
    description: 'No description',
    created_at: '2025-01-01',
    updated_at: '2025-02-01',
    languages: ['TypeScript', 'HTML'],
  },
  {
    repo_id: 2,
    name: 'phenotype-viewer',
    owner: 'lyh',
    custom_title: null,
    is_visible: false,
    description: '이미지 파일과 예측 값 간의 대응 관계 제공',
    created_at: '2024-06-01',
    updated_at: '2025-01-15',
    languages: ['Java'],
  },
  {
    repo_id: 3,
    name: 'springboot-user-crud',
    owner: 'lyh',
    custom_title: null,
    is_visible: false,
    description: 'Spring Boot CRUD 예제',
    created_at: '2024-03-01',
    updated_at: '2025-01-10',
    languages: ['Java'],
  },
  {
    repo_id: 4,
    name: 'tayo_BE',
    owner: 'lyh',
    custom_title: null,
    is_visible: false,
    description: '프로젝트 백엔드',
    created_at: '2024-05-01',
    updated_at: '2025-02-01',
    languages: ['Java', 'Spring'],
  },
  {
    repo_id: 5,
    name: 'test-repo',
    owner: 'lyh',
    custom_title: null,
    is_visible: false,
    description: '테스트 레포',
    created_at: '2025-01-15',
    updated_at: '2025-01-20',
    languages: ['TypeScript'],
  },
];

const INITIAL_MILEAGE: MileageItem[] = [
  {
    mileage_id: 101,
    semester: '2024-02',
    category: '전공',
    item: '선형대수학',
    additional_info: '',
    is_visible: false,
  },
  {
    mileage_id: 102,
    semester: '2024-01',
    category: '비교과',
    item: 'PPS Camp / 나의첫웹서비스',
    additional_info: '상세 설명 (유저 추가)',
    is_visible: false,
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    title: '교내 해커톤 대상',
    description: '소프트웨어 중심대학',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
  },
];

export interface SummaryState {
  sectionOrder: DraggableSectionKey[];
  setSectionOrder: (v: DraggableSectionKey[] | ((p: DraggableSectionKey[]) => DraggableSectionKey[])) => void;
  techStackTags: string[];
  setTechStackTags: (v: string[] | ((p: string[]) => string[])) => void;
  repos: RepoItem[];
  setRepos: (v: RepoItem[] | ((p: RepoItem[]) => RepoItem[])) => void;
  mileageItems: MileageItem[];
  setMileageItems: (v: MileageItem[] | ((p: MileageItem[]) => MileageItem[])) => void;
  activities: ActivityItem[];
  setActivities: (v: ActivityItem[] | ((p: ActivityItem[]) => ActivityItem[])) => void;
  activitiesNextId: number;
  setActivitiesNextId: (v: number | ((p: number) => number)) => void;
}

const SummaryContext = createContext<SummaryState | null>(null);

export const useSummaryContext = () => {
  const ctx = useContext(SummaryContext);
  if (ctx == null) {
    throw new Error('useSummaryContext must be used within SummaryProvider');
  }
  return ctx;
};

interface SummaryProviderProps {
  children: ReactNode;
}

export const SummaryProvider = ({ children }: SummaryProviderProps) => {
  const [sectionOrder, setSectionOrder] = useState<DraggableSectionKey[]>(
    DRAGGABLE_SECTION_ORDER,
  );
  const [techStackTags, setTechStackTags] = useState<string[]>([
    'Java',
    'Spring Boot',
    'TypeScript',
    'React',
  ]);
  const [repos, setRepos] = useState<RepoItem[]>(INITIAL_REPOS);
  const [mileageItems, setMileageItems] = useState<MileageItem[]>(
    INITIAL_MILEAGE,
  );
  const [activities, setActivities] = useState<ActivityItem[]>(
    INITIAL_ACTIVITIES,
  );
  const [activitiesNextId, setActivitiesNextId] = useState(2);

  const value = useMemo<SummaryState>(
    () => ({
      sectionOrder,
      setSectionOrder,
      techStackTags,
      setTechStackTags,
      repos,
      setRepos,
      mileageItems,
      setMileageItems,
      activities,
      setActivities,
      activitiesNextId,
      setActivitiesNextId,
    }),
    [
      sectionOrder,
      techStackTags,
      repos,
      mileageItems,
      activities,
      activitiesNextId,
    ],
  );

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};
