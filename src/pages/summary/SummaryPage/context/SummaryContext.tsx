import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import {
  deleteActivity as deleteActivityApi,
  getActivities,
  getGitHubReposWithFallback,
  getPortfolioMileage,
  getPortfolioSettings,
  getRepositories,
  getTechStack,
  getUserInfo,
  patchActivities,
  postActivity,
  putTechStack,
} from '../../apis/portfolio';
import type {
  GitHubRepoItem,
  PortfolioRepositoryItem,
  UserInfoResponse,
} from '../../apis/portfolio';
import {
  DRAGGABLE_SECTION_ORDER,
  type DraggableSectionKey,
} from '../../constants/constants';

/** 변경사항 반영 대기 시간 (ms). 이 시간 동안 추가 변경이 없으면 모아둔 변경사항을 한꺼번에 API로 전송 */
const DEBOUNCE_PUT_MS = 5_000;

const SAVED_TOAST_OPTIONS = {
  position: 'top-center' as const,
};

/**
 * 활동 요약 API 패턴:
 * - GET: 페이지 진입 시(SummaryProvider 마운트) 1회만 호출
 * - PUT/DELETE/POST: 변경사항이 있을 때 DEBOUNCE_PUT_MS(5초) 동안 추가 변경이 없으면,
 *   그때 모아둔 변경사항을 한꺼번에 API로 전송 (DELETE → POST → PUT 순)
 * - 새 리소스 추가 시: apis/portfolio.ts에 함수 추가 → 여기서 진입 시 GET, 디바운스 후 flush에서 함께 호출
 */

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
  /** GitHub 레포 페이지 URL (제목 클릭 시 이동) */
  html_url?: string;
}

export interface MileageItem {
  /** 포트폴리오 마일리지 항목 id (PUT /api/portfolio/mileage/{id}용) */
  id?: number;
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
  /** 활동 섹션에는 category === 0 인 것만 표시 */
  category?: number;
  /** API 응답용. 0이 맨 위. 로컬 추가분은 없을 수 있음 */
  display_order?: number;
}

const ACTIVITY_SECTION_CATEGORY = 0;
const CERTIFICATE_SECTION_CATEGORY = 1;

function apiActivityToItem(
  a: import('../../apis/portfolio').ActivityApiItem,
): ActivityItem {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    start_date: a.start_date,
    end_date: a.end_date,
    category: a.category,
    display_order: a.display_order,
  };
}

export function mergeRepositories(
  portfolio: PortfolioRepositoryItem[],
  githubRepos: GitHubRepoItem[],
): RepoItem[] {
  const byRepoId = new Map(githubRepos.map(r => [r.repo_id, r]));
  return portfolio
    .sort((a, b) => a.display_order - b.display_order)
    .map(p => {
      const gh = byRepoId.get(p.repo_id);
      return {
        repo_id: p.repo_id,
        custom_title: p.custom_title,
        is_visible: p.is_visible,
        name: gh?.name ?? p.custom_title ?? String(p.repo_id),
        description: p.description || (gh?.description ?? ''),
        created_at: gh?.created_at ?? '',
        updated_at: gh?.updated_at ?? '',
        languages: gh?.languages ?? [],
        html_url: gh?.html_url,
      };
    });
}

export function portfolioMileageToItem(
  p: import('../../apis/portfolio').PortfolioMileageItem,
): MileageItem {
  return {
    id: p.id,
    mileage_id: p.mileage_id,
    semester: p.semester ?? '',
    category: p.categoryName ?? '',
    item: p.subitemName ?? '',
    additional_info: p.additional_info ?? '',
    is_visible: true,
  };
}

export type UserInfo = UserInfoResponse;

export interface SummaryState {
  userInfo: UserInfo | null;
  setUserInfo: (v: UserInfo | null | ((p: UserInfo | null) => UserInfo | null)) => void;
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
  /** 서버에 반영할 삭제는 deleteActivity로 호출 (디바운스 후 DELETE API) */
  deleteActivity: (id: number) => void;
  activitiesNextId: number;
  setActivitiesNextId: (v: number | ((p: number) => number)) => void;
  /** 자격증 섹션 (동일 activities API, category 1) */
  certificates: ActivityItem[];
  setCertificates: (v: ActivityItem[] | ((p: ActivityItem[]) => ActivityItem[])) => void;
  deleteCertificate: (id: number) => void;
  certificatesNextId: number;
  setCertificatesNextId: (v: number | ((p: number) => number)) => void;
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [sectionOrder, setSectionOrder] = useState<DraggableSectionKey[]>(
    DRAGGABLE_SECTION_ORDER,
  );
  const [techStackTags, setTechStackTagsState] = useState<string[]>([]);
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [mileageItems, setMileageItems] = useState<MileageItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesNextId, setActivitiesNextId] = useState(-1);
  const [certificates, setCertificates] = useState<ActivityItem[]>([]);
  const [certificatesNextId, setCertificatesNextId] = useState(-1);

  const techStackUserModifiedRef = useRef(false);
  const activitiesDeletedIdsRef = useRef<Set<number>>(new Set());
  const activitiesFirstRunAfterLoadRef = useRef(true);
  const certificatesDeletedIdsRef = useRef<Set<number>>(new Set());
  const certificatesFirstRunAfterLoadRef = useRef(true);

  const setTechStackTags = useCallback(
    (v: string[] | ((p: string[]) => string[])) => {
      techStackUserModifiedRef.current = true;
      setTechStackTagsState(v);
    },
    [],
  );

  /** 서버 id인 활동 삭제 시 디바운스 flush에서 DELETE 호출하도록 기록 */
  const deleteActivity = useCallback((id: number) => {
    if (id > 0) {
      activitiesDeletedIdsRef.current.add(id);
    }
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  /** 서버 id인 자격증 삭제 시 디바운스 flush에서 DELETE 호출하도록 기록 */
  const deleteCertificate = useCallback((id: number) => {
    if (id > 0) {
      certificatesDeletedIdsRef.current.add(id);
    }
    setCertificates(prev => prev.filter(a => a.id !== id));
  }, []);

  /** 활동 요약 페이지 진입 시 GET 1회 */
  useEffect(() => {
    getPortfolioSettings()
      .then(res => {
        const order = res.section_order ?? [];
        const validKeys = order.filter((k): k is DraggableSectionKey =>
          DRAGGABLE_SECTION_ORDER.includes(k as DraggableSectionKey),
        );
        const missing = DRAGGABLE_SECTION_ORDER.filter(k => !validKeys.includes(k));
        if (validKeys.length > 0) {
          setSectionOrder([...validKeys, ...missing]);
        }
      })
      .catch(() => {
        // 설정 조회 실패 시 기본 순서 유지
      });

    getTechStack()
      .then(res => {
        setTechStackTagsState(res.tech_stack ?? []);
      })
      .catch(() => {
        toast.error('기술 스택을 불러오지 못했습니다.');
      });

    getActivities({ category: [ACTIVITY_SECTION_CATEGORY] })
      .then(res => {
        const list = (res.activities ?? []).filter(
          a => a.category === ACTIVITY_SECTION_CATEGORY,
        );
        const sorted = [...list].sort(
          (a, b) => a.display_order - b.display_order,
        );
        setActivities(sorted.map(apiActivityToItem));
        activitiesFirstRunAfterLoadRef.current = true;
      })
      .catch(() => {
        toast.error('활동 목록을 불러오지 못했습니다.');
      });

    getActivities({ category: [CERTIFICATE_SECTION_CATEGORY] })
      .then(res => {
        const list = (res.activities ?? []).filter(
          a => a.category === CERTIFICATE_SECTION_CATEGORY,
        );
        const sorted = [...list].sort(
          (a, b) => a.display_order - b.display_order,
        );
        setCertificates(sorted.map(apiActivityToItem));
        certificatesFirstRunAfterLoadRef.current = true;
      })
      .catch(() => {
        toast.error('자격증 목록을 불러오지 못했습니다.');
      });

    getUserInfo()
      .then(res => {
        setUserInfo(res);
        try {
          localStorage.setItem(
            'portfolio-user-info',
            JSON.stringify(res),
          );
        } catch {
          // ignore
        }
      })
      .catch(() => {
        toast.error('유저 정보를 불러오지 못했습니다.');
      });

    getRepositories()
      .then(portfolioRes => {
        const repositories = portfolioRes.repositories ?? [];
        return getGitHubReposWithFallback().then(ghRepos => ({
          repositories,
          ghRepos,
        }));
      })
      .then(({ repositories, ghRepos }) => {
        const merged = mergeRepositories(repositories, ghRepos);
        setRepos(merged);
      })
      .catch(() => {
        toast.error('레포지토리 목록을 불러오지 못했습니다.');
      });

    getPortfolioMileage()
      .then(res => {
        const list = res.mileage ?? [];
        const sorted = [...list].sort(
          (a, b) => a.display_order - b.display_order,
        );
        setMileageItems(sorted.map(portfolioMileageToItem));
      })
      .catch(() => {
        toast.error('마일리지 목록을 불러오지 못했습니다.');
      });
  }, []);

  /** 기술 스택 변경 시 디바운스 후 PUT */
  useEffect(() => {
    if (!techStackUserModifiedRef.current) return;

    const id = window.setTimeout(() => {
      putTechStack({ tech_stack: techStackTags })
        .then(() => {
          toast.success('변경사항이 저장되었습니다.', SAVED_TOAST_OPTIONS);
        })
        .catch(() => {
          toast.error('기술 스택 저장에 실패했습니다.');
        });
    }, DEBOUNCE_PUT_MS);

    return () => window.clearTimeout(id);
  }, [techStackTags]);

  /** 활동 변경 시 10초 디바운스 후 DELETE → POST(신규) → PUT(기존) */
  useEffect(() => {
    if (activitiesFirstRunAfterLoadRef.current) {
      activitiesFirstRunAfterLoadRef.current = false;
      return;
    }

    const id = window.setTimeout(async () => {
      let hasError = false;
      const deletedIds = new Set(activitiesDeletedIdsRef.current);
      activitiesDeletedIdsRef.current.clear();

      for (const activityId of deletedIds) {
        try {
          await deleteActivityApi(activityId);
        } catch {
          toast.error('활동 삭제에 실패했습니다.');
          hasError = true;
        }
      }

      const current = activities;
      const toPost = current.filter(a => a.id < 0);
      const toPut = current.filter(a => a.id > 0);

      if (toPost.length > 0) {
        try {
          const posted: import('../../apis/portfolio').ActivityApiItem[] =
            await Promise.all(
              toPost.map(a =>
                postActivity({
                  title: a.title,
                  description: a.description,
                  start_date: a.start_date,
                  end_date: a.end_date,
                  category: ACTIVITY_SECTION_CATEGORY,
                }),
              ),
            );
          const newIds = new Set(toPost.map(a => a.id));
          let i = 0;
          setActivities(prev =>
            prev.map(x =>
              newIds.has(x.id) ? apiActivityToItem(posted[i++]) : x,
            ),
          );
        } catch {
          toast.error('활동 추가에 실패했습니다.');
          hasError = true;
        }
      }

      if (toPut.length > 0) {
        try {
          await patchActivities(
            toPut.map(a => ({
              id: a.id,
              title: a.title,
              description: a.description,
              start_date: a.start_date,
              end_date: a.end_date,
              category: ACTIVITY_SECTION_CATEGORY,
            })),
          );
        } catch {
          toast.error('활동 수정에 실패했습니다.');
          hasError = true;
        }
      }

      if (!hasError) {
        toast.success('변경사항이 저장되었습니다.', SAVED_TOAST_OPTIONS);
      }
    }, DEBOUNCE_PUT_MS);

    return () => window.clearTimeout(id);
  }, [activities]);

  /** 자격증 변경 시 디바운스 후 DELETE → POST → PATCH (category 1) */
  useEffect(() => {
    if (certificatesFirstRunAfterLoadRef.current) {
      certificatesFirstRunAfterLoadRef.current = false;
      return;
    }

    const id = window.setTimeout(async () => {
      let hasError = false;
      const deletedIds = new Set(certificatesDeletedIdsRef.current);
      certificatesDeletedIdsRef.current.clear();

      for (const certId of deletedIds) {
        try {
          await deleteActivityApi(certId);
        } catch {
          toast.error('자격증 삭제에 실패했습니다.');
          hasError = true;
        }
      }

      const current = certificates;
      const toPost = current.filter(a => a.id < 0);
      const toPut = current.filter(a => a.id > 0);

      if (toPost.length > 0) {
        try {
          const posted: import('../../apis/portfolio').ActivityApiItem[] =
            await Promise.all(
              toPost.map(a =>
                postActivity({
                  title: a.title,
                  description: a.description,
                  start_date: a.start_date,
                  end_date: a.end_date,
                  category: CERTIFICATE_SECTION_CATEGORY,
                }),
              ),
            );
          const newIds = new Set(toPost.map(a => a.id));
          let i = 0;
          setCertificates(prev =>
            prev.map(x =>
              newIds.has(x.id) ? apiActivityToItem(posted[i++]) : x,
            ),
          );
        } catch {
          toast.error('자격증 추가에 실패했습니다.');
          hasError = true;
        }
      }

      if (toPut.length > 0) {
        try {
          await patchActivities(
            toPut.map(a => ({
              id: a.id,
              title: a.title,
              description: a.description,
              start_date: a.start_date,
              end_date: a.end_date,
              category: CERTIFICATE_SECTION_CATEGORY,
            })),
          );
        } catch {
          toast.error('자격증 수정에 실패했습니다.');
          hasError = true;
        }
      }

      if (!hasError) {
        toast.success('변경사항이 저장되었습니다.', SAVED_TOAST_OPTIONS);
      }
    }, DEBOUNCE_PUT_MS);

    return () => window.clearTimeout(id);
  }, [certificates]);

  const value = useMemo<SummaryState>(
    () => ({
      userInfo,
      setUserInfo,
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
      deleteActivity,
      activitiesNextId,
      setActivitiesNextId,
      certificates,
      setCertificates,
      deleteCertificate,
      certificatesNextId,
      setCertificatesNextId,
    }),
    [
      userInfo,
      sectionOrder,
      techStackTags,
      setTechStackTags,
      repos,
      mileageItems,
      activities,
      deleteActivity,
      activitiesNextId,
      certificates,
      deleteCertificate,
      certificatesNextId,
    ],
  );

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};
