import { Flex, Text } from '@/components';
import { ROUTE_PATH } from '@/constants/routePath';
import { MAX_RESPONSIVE_WIDTH } from '@/constants/system';
import { boxShadow } from '@/styles/common';
import { palette } from '@/styles/palette';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LinkIcon from '@mui/icons-material/Link';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme, useMediaQuery } from '@mui/material';

import { formatDateRange } from '../../utils/date';
import { useSummaryContext } from '../context/SummaryContext';

const GITHUB_STORAGE_KEY = 'github-storage';
const ITEMS_PER_PAGE = 4;

function getGithubUsernameFromStorage(): string | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(GITHUB_STORAGE_KEY) : null;
    if (!raw) return null;
    const data = JSON.parse(raw) as {
      state?: { connected?: boolean; githubName?: string | null };
      githubUsername?: string;
    } | null;
    const name = data?.state?.githubName ?? data?.githubUsername;
    return typeof name === 'string' && name.trim() ? name.trim() : null;
  } catch {
    return null;
  }
}

interface RepoSectionContentProps {
  readOnly?: boolean;
}

/** 깃허브 레포지토리. 추후 PUT /api/portfolio/repositories (repo_id, custom_title, is_visible) 연동 */
const RepoSectionContent = ({ readOnly = false }: RepoSectionContentProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(MAX_RESPONSIVE_WIDTH);
  const { repos: contextRepos } = useSummaryContext();
  const repos = Array.isArray(contextRepos) ? contextRepos : [];
  const [page, setPage] = useState(0);

  const hasGithubInStorage = useMemo(() => getGithubUsernameFromStorage(), []);

  const displayRepos = useMemo(() => {
    if (readOnly) return repos.filter(r => r.is_visible);
    return repos;
  }, [repos, readOnly]);

  const totalPages = Math.ceil(displayRepos.length / ITEMS_PER_PAGE) || 1;
  const paginatedRepos = useMemo(
    () =>
      displayRepos.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      ),
    [displayRepos, page],
  );

  if (!readOnly && !hasGithubInStorage) {
    return (
      <S.ConnectCard>
        <S.ConnectMessage>
          깃허브 계정이 연결되어 있지 않습니다. 깃허브 계정 연결을 통해
          포트폴리오 항목을 추가할 수 있습니다.
        </S.ConnectMessage>
        <S.ConnectButton type="button" onClick={() => navigate(ROUTE_PATH.myPage)}>
          <LinkIcon sx={{ fontSize: 18 }} />
          깃허브 계정 연결
        </S.ConnectButton>
      </S.ConnectCard>
    );
  }

  if (!readOnly && hasGithubInStorage && displayRepos.length === 0) {
    return (
      <S.ConnectCard>
        <S.ConnectMessage>선택된 레포지토리가 없습니다.</S.ConnectMessage>
      </S.ConnectCard>
    );
  }

  const displayName = (repo: { custom_title: string | null; name: string }) =>
    repo.custom_title ?? repo.name;

  return (
    <Flex.Column gap="1rem">
      <S.Grid $isMobile={isMobile}>
        {paginatedRepos.map(repo => (
          <S.Card key={repo.repo_id} $isMobile={isMobile}>
            <Flex.Column gap="0.5rem">
              <S.RepoLink
                href={repo.html_url ?? '#'}
                target={repo.html_url ? '_blank' : undefined}
                rel={repo.html_url ? 'noopener noreferrer' : undefined}
              >
                {displayName(repo)}
              </S.RepoLink>
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
                {formatDateRange(repo.created_at, repo.updated_at)}
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
  ConnectCard: styled('div')`
    padding: 1.5rem;
    border-radius: 0.75rem;
    background-color: ${({ theme }) => theme.palette.grey[50]};
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
  `,
  ConnectMessage: styled('p')`
    margin: 0;
    font-size: 1rem;
    line-height: 1.65;
    letter-spacing: 0.01em;
    color: ${palette.grey600};
    font-weight: 500;
  `,
  ConnectButton: styled('button')`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    background-color: ${palette.blue500};
    color: ${palette.white};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    align-self: flex-start;
    box-shadow: 0 1px 3px rgba(83, 127, 241, 0.25);
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
    &:hover {
      background-color: ${palette.blue600};
      box-shadow: 0 2px 6px rgba(83, 127, 241, 0.3);
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
