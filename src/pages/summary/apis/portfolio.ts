import { ENDPOINT } from '@/apis/endPoint';
import { http } from '@/apis/http';

export interface TechStackResponse {
  tech_stack: string[];
}

export interface TechStackPutRequest {
  tech_stack: string[];
}

/** API 활동 한 건 (display_order: 0이 맨 위) */
export interface ActivityApiItem {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  display_order: number;
}

export interface ActivitiesResponse {
  activities: ActivityApiItem[];
}

export interface ActivityPostRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface ActivityPutRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

/** 활동 요약 - 유저 정보 (학기·grade는 화면에 미표시) */
export interface UserInfoResponse {
  name: string;
  department: string;
  major1: string;
  major2: string;
  grade: number;
  semester: number;
  bio: string;
}

export interface UserInfoPatchRequest {
  bio: string;
}

/** 활동 요약 - 기술 스택 조회 (페이지 진입 시 1회) */
export const getTechStack = async () => {
  const response = await http.get<TechStackResponse>(
    ENDPOINT.PORTFOLIO_TECH_STACK,
  );
  return response;
};

/** 활동 요약 - 기술 스택 수정 (디바운스 후 1회) */
export const putTechStack = async (body: TechStackPutRequest) => {
  const response = await http.put<unknown>(
    ENDPOINT.PORTFOLIO_TECH_STACK,
    body,
  );
  return response;
};

/** 활동 요약 - 활동 목록 조회 (페이지 진입 시 1회, display_order 0이 맨 위) */
export const getActivities = async () => {
  const response = await http.get<ActivitiesResponse>(
    ENDPOINT.PORTFOLIO_ACTIVITIES,
  );
  return response;
};

/** 활동 요약 - 활동 추가 */
export const postActivity = async (body: ActivityPostRequest) => {
  const response = await http.post<
    ActivityPostRequest,
    ActivityApiItem
  >(ENDPOINT.PORTFOLIO_ACTIVITIES, body);
  return response;
};

/** 활동 요약 - 활동 수정 */
export const putActivity = async (
  id: number,
  body: ActivityPutRequest,
) => {
  const response = await http.put<
    ActivityPutRequest,
    ActivityApiItem
  >(`${ENDPOINT.PORTFOLIO_ACTIVITIES}/${id}`, body);
  return response;
};

/** 활동 요약 - 활동 삭제 */
export const deleteActivity = async (id: number) => {
  const response = await http.delete<unknown>(
    `${ENDPOINT.PORTFOLIO_ACTIVITIES}/${id}`,
  );
  return response;
};

/** 활동 요약 - 유저 정보 조회 (페이지 진입 시 1회) */
export const getUserInfo = async () => {
  const response = await http.get<UserInfoResponse>(
    ENDPOINT.PORTFOLIO_USER_INFO,
  );
  return response;
};

/** 활동 요약 - 유저 정보 수정 (bio만) */
export const patchUserInfo = async (body: UserInfoPatchRequest) => {
  const response = await http.patch<
    UserInfoPatchRequest,
    UserInfoResponse
  >(ENDPOINT.PORTFOLIO_USER_INFO, body);
  return response;
};

/** 활동 요약 - 포트폴리오 레포지토리 한 건 (GET 응답) */
export interface PortfolioRepositoryItem {
  id: number;
  repo_id: number;
  custom_title: string | null;
  description: string;
  is_visible: boolean;
  display_order: number;
}

export interface RepositoriesResponse {
  repositories: PortfolioRepositoryItem[];
}

/** 활동 요약 - 포트폴리오 레포지토리 PUT 요청 한 건 */
export interface PutRepositoryItem {
  repo_id: number;
  custom_title: string | null;
  description: string;
  is_visible: boolean;
}

/** GitHub 레포 목록 한 건 (선택 모달용) */
export interface GitHubRepoItem {
  repo_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  languages: string[];
}

export interface GitHubReposResponse {
  repos: GitHubRepoItem[];
}

/** 활동 요약 - 포트폴리오 레포지토리 조회 */
export const getRepositories = async () => {
  const response = await http.get<RepositoriesResponse>(
    ENDPOINT.PORTFOLIO_REPOSITORIES,
  );
  return response;
};

/** 활동 요약 - 포트폴리오 레포지토리 전체 교체 (PUT) */
export const putRepositories = async (body: PutRepositoryItem[]) => {
  const response = await http.put<PutRepositoryItem[], RepositoriesResponse>(
    ENDPOINT.PORTFOLIO_REPOSITORIES,
    body,
  );
  return response;
};

/** 활동 요약 - 연결된 GitHub 레포 목록 조회 (선택 모달용) */
export const getGitHubRepos = async () => {
  const response = await http.get<GitHubReposResponse>(
    ENDPOINT.PORTFOLIO_GITHUB_REPOS,
  );
  return response;
};
