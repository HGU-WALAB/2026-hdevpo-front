import { Flex, Text } from '@/components';
import { MAX_RESPONSIVE_WIDTH } from '@/constants/system';
import { boxShadow } from '@/styles/common';
import { palette } from '@/styles/palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled, useTheme, useMediaQuery } from '@mui/material';

const ITEMS_PER_PAGE = 4;

/** API 형식: { repo_id, custom_title, is_visible } */
interface RepoItem {
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

interface RepoSectionContentProps {
  searchQuery?: string;
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

/** 깃허브 레포지토리. 추후 PUT /api/portfolio/repositories (repo_id, custom_title, is_visible) 연동 */
const RepoSectionContent = ({ searchQuery = '' }: RepoSectionContentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(MAX_RESPONSIVE_WIDTH);
  const [repos, setRepos] = useState<RepoItem[]>(INITIAL_REPOS);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const filteredRepos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return repos;
    return repos.filter(r => r.name.toLowerCase().includes(q));
  }, [repos, searchQuery]);

  const visibleRepos = useMemo(
    () => repos.filter(r => r.is_visible).map(r => r.custom_title ?? r.name),
    [repos],
  );

  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE) || 1;
  const paginatedRepos = useMemo(
    () =>
      filteredRepos.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      ),
    [filteredRepos, page],
  );

  const handleToggleVisible = useCallback((repoId: number) => {
    setRepos(prev =>
      prev.map(r =>
        r.repo_id === repoId ? { ...r, is_visible: !r.is_visible } : r,
      ),
    );
  }, []);

  const displayName = (repo: RepoItem) =>
    repo.custom_title ?? repo.name;

  return (
    <Flex.Column gap="1rem">
      {visibleRepos.length > 0 && (
        <Flex.Row gap="0.5rem" wrap="wrap" align="center">
          <Text
            style={{
              ...theme.typography.caption,
              color: theme.palette.grey[600],
              marginRight: '0.25rem',
            }}
          >
            활성화된 레포:
          </Text>
          {visibleRepos.map(name => (
            <S.ActiveTag key={name}>{name}</S.ActiveTag>
          ))}
        </Flex.Row>
      )}
      <S.Grid $isMobile={isMobile}>
        {paginatedRepos.map(repo => (
          <S.Card key={repo.repo_id} $isMobile={isMobile}>
            <Flex.Row justify="flex-end" style={{ marginBottom: '0.25rem' }}>
              <S.EyeButton
                type="button"
                onClick={() => handleToggleVisible(repo.repo_id)}
                aria-label={repo.is_visible ? '미리보기에 숨기기' : '미리보기에 표시'}
              >
                {repo.is_visible ? (
                  <VisibilityIcon
                    sx={{
                      fontSize: 18,
                      color: palette.blue500,
                    }}
                  />
                ) : (
                  <VisibilityOffOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: theme.palette.grey[500],
                    }}
                  />
                )}
              </S.EyeButton>
            </Flex.Row>
            <Flex.Column gap="0.5rem">
              <S.RepoLink href="#">{displayName(repo)}</S.RepoLink>
              <Text
                style={{
                  ...theme.typography.body2,
                  color: theme.palette.grey[600],
                }}
              >
                {repo.description}
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.palette.grey[500],
                }}
              >
                {repo.created_at} ~ {repo.updated_at}
              </Text>
              <Flex.Row gap="0.5rem" wrap="wrap">
                {repo.languages.map(lang => (
                  <S.LangTag key={lang}>{lang}</S.LangTag>
                ))}
              </Flex.Row>
            </Flex.Column>
          </S.Card>
        ))}
      </S.Grid>
      {totalPages > 1 && (
        <S.Pagination align="center" gap="0.5rem">
          <S.PageButton
            type="button"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </S.PageButton>
          <Text
            style={{
              ...theme.typography.body2,
              color: theme.palette.grey[600],
            }}
          >
            {page + 1} / {totalPages}
          </Text>
          <S.PageButton
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </S.PageButton>
        </S.Pagination>
      )}
    </Flex.Column>
  );
};

export default RepoSectionContent;

const S = {
  EyeButton: styled('button')`
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      opacity: 0.8;
    }
  `,
  Grid: styled('div')<{ $isMobile?: boolean }>`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
  `,
  Card: styled('div')<{ $isMobile?: boolean }>`
    flex: ${({ $isMobile }) => ($isMobile ? '1 1 100%' : '1 1 18rem')};
    min-width: 0;
    padding: 1.25rem;
    border-radius: 0.75rem;
    background: ${({ theme }) =>
      `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`};
    border-left: 3px solid ${palette.blue400};
    ${boxShadow};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(83, 127, 241, 0.12);
    }
  `,
  RepoLink: styled('a')`
    ${({ theme }) => theme.typography.body1};
    font-weight: 600;
    color: ${palette.blue500};
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover {
      color: ${palette.blue600};
    }
  `,
  LangTag: styled('span')`
    padding: 0.3rem 0.625rem;
    border-radius: 999px;
    background-color: ${palette.white};
    color: ${palette.blue500};
    border: 1.5px solid ${palette.blue400};
    ${({ theme }) => theme.typography.caption};
    font-size: 0.75rem;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(83, 127, 241, 0.08);
  `,
  ActiveTag: styled('span')`
    padding: 0.375rem 0.75rem;
    border-radius: 999px;
    background-color: ${palette.white};
    color: ${palette.blue500};
    border: 1.5px solid ${palette.blue400};
    ${({ theme }) => theme.typography.body2};
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(83, 127, 241, 0.08);
  `,
  Pagination: styled(Flex.Row)`
    margin-top: 0.5rem;
  `,
  PageButton: styled('button')`
    padding: 0.25rem;
    border: none;
    background: none;
    cursor: pointer;
    color: ${({ theme }) => theme.palette.grey[600]};
    border-radius: 0.25rem;
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.palette.grey[200]};
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
};
