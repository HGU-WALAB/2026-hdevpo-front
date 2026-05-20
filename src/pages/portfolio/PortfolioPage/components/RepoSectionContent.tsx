import { Button, Flex, Input, Text } from '@/components';
import { MAX_RESPONSIVE_WIDTH } from '@/constants/system';
import { ROUTE_PATH } from '@/constants/routePath';
import { palette } from '@/styles/palette';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {
  useCallback,
  useMemo,
  useState,
  type FunctionComponent,
  type SVGProps,
} from 'react';
import { styled, useTheme, useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { INPUT_MAX_LENGTH } from '../../constants/inputLimits';
import type { PatchRepositoryBody } from '../../apis/repositories';
import { patchRepository } from '../../apis/repositories';
import {
  formatDateOnly,
  formatRepositoryDisplayDateRange,
  resolveRepositoryDurationIso,
} from '../../utils/date';
import {
  mergePortfolioRepoPatch,
  usePortfolioContext,
} from '../context/PortfolioContext';
import type { RepoItem } from '../../types/portfolioItems';
import useGetGitHubStatusQuery from '@/pages/profile/hooks/useGetGitHubStatusQuery';
import {
  formatRepoStat,
  RepoLanguageBar,
  RepoStatPills,
} from './repoCardMeta';

const ITEMS_PER_PAGE = 4;

const AddIconWrap: FunctionComponent<SVGProps<SVGSVGElement>> = () => (
  <AddIcon sx={{ fontSize: 18 }} />
);

interface RepoSectionContentProps {
  readOnly?: boolean;
}

/** 깃허브 레포지토리. GET /api/portfolio/repositories 페이지네이션으로 조회, is_visible true만 표시 */
const RepoSectionContent = ({ readOnly = false }: RepoSectionContentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(MAX_RESPONSIVE_WIDTH);
  const navigate = useNavigate();
  const { data: githubStatus } = useGetGitHubStatusQuery();
  const { repos: contextRepos, setRepos } = usePortfolioContext();
  const repos = Array.isArray(contextRepos) ? contextRepos : [];
  const [page, setPage] = useState(0);
  const [editingRepo, setEditingRepo] = useState<RepoItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTeam, setEditTeam] = useState<{ role: string; count: number }[]>([
    { role: '', count: 1 },
  ]);
  const [editMyRoleRole, setEditMyRoleRole] = useState('');
  const [editMyRolePercent, setEditMyRolePercent] = useState(0);
  const [editKeyContributions, setEditKeyContributions] = useState('');
  const [editDurStart, setEditDurStart] = useState('');
  const [editDurEnd, setEditDurEnd] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openEdit = useCallback((repo: RepoItem) => {
    setEditingRepo(repo);
    setEditTitle(
      (repo.custom_title != null && repo.custom_title.trim() !== '')
        ? repo.custom_title.trim()
        : repo.github_title || repo.name,
    );
    setEditDescription(repo.description ?? '');
    const rows = repo.team_composition?.filter(
      t => (t.role ?? '').trim() !== '' || (Number(t.count) || 0) > 0,
    );
    setEditTeam(
      rows && rows.length > 0
        ? rows.map(t => ({
            role: (t.role ?? '').trim(),
            count: Math.max(0, Number(t.count) || 0),
          }))
        : [{ role: '', count: 1 }],
    );
    setEditMyRoleRole(repo.my_role?.role ?? '');
    setEditMyRolePercent(repo.my_role?.contribution_percent ?? 0);
    setEditKeyContributions(repo.key_contributions ?? '');
    setEditDurStart(
      formatDateOnly(resolveRepositoryDurationIso(repo, 'start')),
    );
    setEditDurEnd(formatDateOnly(resolveRepositoryDurationIso(repo, 'end')));
  }, []);

  const closeEdit = useCallback(() => {
    setEditingRepo(null);
    setEditTitle('');
    setEditDescription('');
    setEditTeam([{ role: '', count: 1 }]);
    setEditMyRoleRole('');
    setEditMyRolePercent(0);
    setEditKeyContributions('');
    setEditDurStart('');
    setEditDurEnd('');
  }, []);

  const addTeamRow = useCallback(() => {
    setEditTeam(prev => [...prev, { role: '', count: 1 }]);
  }, []);

  const removeTeamRow = useCallback((index: number) => {
    setEditTeam(prev =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (editingRepo?.id == null) return;
    const ds = editDurStart.trim();
    const de = editDurEnd.trim();
    if (ds && de && ds > de) {
      toast.error('표시 시작일은 종료일과 같거나 이전이어야 합니다.');
      return;
    }
    setSubmitting(true);
    try {
      const teamPayload = editTeam
        .filter(row => row.role.trim() !== '')
        .map(row => ({
          role: row.role.trim(),
          count: Math.max(0, Math.min(99_999, Number(row.count) || 0)),
        }));

      const myRolePayload =
        editMyRoleRole.trim() !== ''
          ? {
              role: editMyRoleRole.trim(),
              contribution_percent: Math.min(
                100,
                Math.max(0, Math.round(Number(editMyRolePercent) || 0)),
              ),
            }
          : null;

      const patchBody: PatchRepositoryBody = {
        custom_title:
          editTitle.trim() || editingRepo.github_title || editingRepo.name,
        description: editDescription.trim(),
        is_visible: editingRepo.is_visible,
        display_order: editingRepo.display_order ?? 0,
        team_composition: teamPayload,
        my_role: myRolePayload,
        key_contributions: editKeyContributions.trim() || null,
        duration: {
          started_at: ds,
          updated_at: de,
        },
      };

      const res = await patchRepository(editingRepo.id, patchBody);
      setRepos(prev =>
        prev.map(r =>
          r.repo_id === res.repo_id ? mergePortfolioRepoPatch(r, res) : r,
        ),
      );
      toast.success('레포지토리 정보가 수정되었습니다.', {
        position: 'top-center',
      });
      closeEdit();
    } catch {
      toast.error('레포지토리 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }, [
    editingRepo,
    editTitle,
    editDescription,
    editTeam,
    editMyRoleRole,
    editMyRolePercent,
    editKeyContributions,
    editDurStart,
    editDurEnd,
    setRepos,
    closeEdit,
  ]);

  const displayRepos = useMemo(
    () => repos.filter(r => r.is_visible),
    [repos],
  );

  const totalPages = Math.ceil(displayRepos.length / ITEMS_PER_PAGE) || 1;
  const paginatedRepos = useMemo(
    () =>
      displayRepos.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      ),
    [displayRepos, page],
  );

  const isConnected = githubStatus?.connected ?? false;

  const connectCard = (
    <S.ConnectCard>
      <Flex.Column gap="0.75rem" style={{ width: '100%' }}>
        <S.ConnectMessage>
          {isConnected
            ? '선택된 레포지토리가 없습니다.'
            : '깃허브 계정을 연결해 레포지토리를 추가해 주세요.'}
        </S.ConnectMessage>
        {!readOnly && !isConnected && (
          <Flex.Row justify="flex-start" style={{ width: '100%' }}>
            <Button
              label="마이페이지로 이동"
              variant="contained"
              color="blue"
              size="medium"
              onClick={() => navigate(ROUTE_PATH.myPage)}
            />
          </Flex.Row>
        )}
      </Flex.Column>
    </S.ConnectCard>
  );

  // 깃허브가 연결 해제된 상태라면, 선택된 레포가 있더라도 표시하지 않습니다.
  if (!isConnected) {
    return connectCard;
  }

  if (!readOnly && displayRepos.length === 0) {
    return connectCard;
  }

  const displayName = (repo: RepoItem) =>
    (repo.custom_title != null && repo.custom_title.trim() !== '')
      ? repo.custom_title.trim()
      : (repo.github_title != null && repo.github_title.trim() !== '')
        ? repo.github_title.trim()
        : (repo.name != null && repo.name.trim() !== '')
          ? repo.name.trim()
          : String(repo.repo_id);

  const displayDescription = (repo: RepoItem) => {
    const custom = (repo.description ?? '').trim();
    if (custom !== '') return custom;
    const gh = (repo.github_description ?? '').trim();
    return gh;
  };

  return (
    <Flex.Column gap="1rem">
      <S.Grid $isMobile={isMobile}>
        {paginatedRepos.map(repo => {
          const isEditing = editingRepo?.repo_id === repo.repo_id;
          const githubDescriptionPlaceholder =
            (repo.github_description ?? '').trim() || '설명을 입력하세요';
          return (
            <S.Card key={repo.repo_id} $isMobile={isMobile}>
              {isEditing ? (
                <Flex.Column gap="0.75rem" style={{ width: '100%', minWidth: 0 }}>
                  <Input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder={displayName(repo)}
                    size="small"
                    fullWidth
                    inputProps={{
                      maxLength: INPUT_MAX_LENGTH.REPO_TITLE,
                      'aria-label': '레포지토리 제목',
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.variant.default,
                      },
                    }}
                  />
                  <Input
                    multiline
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder={githubDescriptionPlaceholder}
                    rows={2}
                    size="small"
                    fullWidth
                    inputProps={{
                      maxLength: INPUT_MAX_LENGTH.REPO_DESCRIPTION,
                      'aria-label': '레포지토리 설명',
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.variant.default,
                      },
                      '& textarea': {
                        resize: 'vertical',
                      },
                    }}
                  />

                  <Flex.Column gap="0.35rem" style={{ width: '100%' }}>
                    <S.FieldLabel>전체 팀 구성</S.FieldLabel>
                    <Text
                      margin="0"
                      style={{
                        ...theme.typography.caption,
                        color: theme.palette.grey[600],
                      }}
                    >
                      역할과 인원 수를 입력합니다. 예: FE 2, BE 2, PM 1
                    </Text>
                    {editTeam.map((row, idx) => (
                      <Flex.Row
                        key={`team-${idx}`}
                        align="flex-start"
                        gap="0.5rem"
                        wrap="wrap"
                        style={{ width: '100%', minWidth: 0 }}
                      >
                        <Flex.Column
                          gap="0.25rem"
                          style={{
                            flex: '1 1 10rem',
                            minWidth: 0,
                            maxWidth: '100%',
                          }}
                        >
                          <Input
                            value={row.role}
                            onChange={e => {
                              const v = e.target.value;
                              setEditTeam(prev =>
                                prev.map((t, i) =>
                                  i === idx ? { ...t, role: v } : t,
                                ),
                              );
                            }}
                            placeholder="역할 (예: FE)"
                            size="small"
                            fullWidth
                            inputProps={{
                              maxLength: INPUT_MAX_LENGTH.REPO_ROLE_LABEL,
                              'aria-label': `팀 역할 ${idx + 1}`,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.variant.default,
                              },
                            }}
                          />
                        </Flex.Column>
                        <Flex.Column
                          gap="0.25rem"
                          style={{
                            flex: isMobile ? '1 1 6rem' : '0 0 5.5rem',
                            minWidth: 0,
                          }}
                        >
                          <Input
                            value={row.count === 0 ? '' : String(row.count)}
                            onChange={e => {
                              const raw = e.target.value;
                              const n = raw === '' ? 0 : Number(raw);
                              setEditTeam(prev =>
                                prev.map((t, i) =>
                                  i === idx
                                    ? {
                                        ...t,
                                        count: Number.isFinite(n)
                                          ? Math.max(
                                              0,
                                              Math.min(99_999, Math.floor(n)),
                                            )
                                          : 0,
                                      }
                                    : t,
                                ),
                              );
                            }}
                            placeholder="인원"
                            size="small"
                            fullWidth
                            inputProps={{
                              min: 0,
                              max: 99_999,
                              inputMode: 'numeric',
                              'aria-label': `팀 역할 ${idx + 1} 인원 수`,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.variant.default,
                              },
                            }}
                          />
                        </Flex.Column>
                        <S.IconGhostMini
                          type="button"
                          onClick={() => removeTeamRow(idx)}
                          aria-label={`팀 역할 ${idx + 1} 삭제`}
                          title="삭제"
                        >
                          <CloseIcon sx={{ fontSize: 18 }} />
                        </S.IconGhostMini>
                      </Flex.Row>
                    ))}
                    <Flex.Row justify="flex-start" style={{ width: '100%' }}>
                      <Button
                        label="역할 행 추가"
                        variant="outlined"
                        color="blue"
                        size="small"
                        icon={AddIconWrap}
                        iconPosition="start"
                        onClick={addTeamRow}
                      />
                    </Flex.Row>
                  </Flex.Column>

                  <Flex.Column gap="0.35rem" style={{ width: '100%' }}>
                    <S.FieldLabel>내 역할 · 기여도 (0–100%)</S.FieldLabel>
                    <Flex.Row
                      gap="0.5rem"
                      wrap="wrap"
                      style={{ width: '100%', minWidth: 0 }}
                    >
                      <Flex.Column
                        style={{ flex: '1 1 12rem', minWidth: 0 }}
                      >
                        <Input
                          value={editMyRoleRole}
                          onChange={e => setEditMyRoleRole(e.target.value)}
                          placeholder="예: Frontend developer"
                          size="small"
                          fullWidth
                          inputProps={{
                            maxLength: INPUT_MAX_LENGTH.REPO_ROLE_LABEL,
                            'aria-label': '내 역할',
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.variant.default,
                            },
                          }}
                        />
                      </Flex.Column>
                      <Flex.Column
                        style={{
                          flex: isMobile ? '1 1 6rem' : '0 0 5.5rem',
                          minWidth: 0,
                        }}
                      >
                        <Input
                          value={
                            editMyRolePercent === 0 && editMyRoleRole === ''
                              ? ''
                              : String(editMyRolePercent)
                          }
                          onChange={e => {
                            const raw = e.target.value;
                            const n = raw === '' ? 0 : Number(raw);
                            setEditMyRolePercent(
                              Number.isFinite(n)
                                ? Math.min(
                                    100,
                                    Math.max(0, Math.round(n)),
                                  )
                                : 0,
                            );
                          }}
                          placeholder="%"
                          size="small"
                          fullWidth
                          inputProps={{
                            min: 0,
                            max: 100,
                            inputMode: 'numeric',
                            'aria-label': '기여도 퍼센트',
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.variant.default,
                            },
                          }}
                        />
                      </Flex.Column>
                    </Flex.Row>
                  </Flex.Column>

                  <Flex.Column gap="0.35rem" style={{ width: '100%' }}>
                    <S.FieldLabel>주요 기여</S.FieldLabel>
                    <Input
                      multiline
                      value={editKeyContributions}
                      onChange={e =>
                        setEditKeyContributions(e.target.value)
                      }
                      placeholder={
                        '주요 기능, 트러블슈팅, 결과 및 성과를 적어 주세요.\n예:\n- Designed AI customization…\n- Integrated GitHub repo visualisation…'
                      }
                      rows={4}
                      size="small"
                      fullWidth
                      inputProps={{
                        maxLength: INPUT_MAX_LENGTH.REPO_KEY_CONTRIBUTIONS,
                        'aria-label': '주요 기여',
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: theme.palette.variant.default,
                        },
                        '& textarea': {
                          resize: 'vertical',
                        },
                      }}
                    />
                    <Text
                      margin="0"
                      style={{
                        ...theme.typography.caption,
                        color: theme.palette.grey[500],
                        alignSelf: 'flex-end',
                      }}
                    >
                      {editKeyContributions.length} /{' '}
                      {INPUT_MAX_LENGTH.REPO_KEY_CONTRIBUTIONS}
                    </Text>
                  </Flex.Column>

                  <Flex.Column gap="0.35rem" style={{ width: '100%' }}>
                    <S.FieldLabel>표시 기간</S.FieldLabel>
                    <Flex.Row
                      gap="0.5rem"
                      wrap="wrap"
                      style={{ width: '100%', minWidth: 0 }}
                    >
                      <Flex.Column
                        style={{ flex: '1 1 11rem', minWidth: 0 }}
                      >
                        <Input
                          type="date"
                          value={editDurStart}
                          onChange={e => setEditDurStart(e.target.value)}
                          size="small"
                          fullWidth
                          inputProps={{
                            'aria-label': '표시 시작일',
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.variant.default,
                            },
                          }}
                        />
                      </Flex.Column>
                      <Flex.Column
                        style={{ flex: '1 1 11rem', minWidth: 0 }}
                      >
                        <Input
                          type="date"
                          value={editDurEnd}
                          onChange={e => setEditDurEnd(e.target.value)}
                          size="small"
                          fullWidth
                          inputProps={{
                            'aria-label': '표시 종료일',
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.variant.default,
                            },
                          }}
                        />
                      </Flex.Column>
                    </Flex.Row>
                  </Flex.Column>

                  <Flex.Row gap="0.5rem" justify="flex-end" wrap="wrap">
                    <Button
                      label="취소"
                      variant="outlined"
                      size="medium"
                      onClick={closeEdit}
                    />
                    <Button
                      label="저장"
                      variant="contained"
                      color="blue"
                      size="medium"
                      disabled={submitting}
                      onClick={handleSaveEdit}
                    />
                  </Flex.Row>
                </Flex.Column>
              ) : (
                <Flex.Column gap="0.5rem" style={{ width: '100%' }}>
                  <Flex.Row
                    align="center"
                    gap="0.5rem"
                    wrap="wrap"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <S.RepoLink
                      href={repo.html_url ?? '#'}
                      target={repo.html_url ? '_blank' : undefined}
                      rel={repo.html_url ? 'noopener noreferrer' : undefined}
                      style={{ flex: '1 1 auto', minWidth: 0 }}
                    >
                      {displayName(repo)}
                    </S.RepoLink>
                    {!readOnly && repo.id != null && (
                      <S.EditButton
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          openEdit(repo);
                        }}
                        aria-label="레포지토리 정보 수정"
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </S.EditButton>
                    )}
                  </Flex.Row>
                  {displayDescription(repo) !== '' && (
                    <Text
                      style={{
                        ...theme.typography.body2,
                        color: theme.palette.grey[600],
                      }}
                    >
                      {displayDescription(repo)}
                    </Text>
                  )}
                  {(repo.team_composition?.some(t => t.role.trim()) ?? false) ? (
                    <Flex.Row gap="0.375rem" wrap="wrap" style={{ width: '100%' }}>
                      {(repo.team_composition ?? [])
                        .filter(t => t.role.trim())
                        .map((t, i) => (
                          <S.TeamChip key={`${t.role}-${i}`}>
                            {t.role.trim()} {t.count}
                          </S.TeamChip>
                        ))}
                    </Flex.Row>
                  ) : null}
                  {repo.my_role?.role?.trim() ? (
                    <Text
                      margin="0"
                      style={{
                        ...theme.typography.body2,
                        color: theme.palette.grey[700],
                      }}
                    >
                      내 역할: {repo.my_role.role.trim()} · 기여도{' '}
                      {repo.my_role.contribution_percent}%
                    </Text>
                  ) : null}
                  {(repo.key_contributions ?? '').trim() !== '' ? (
                    <Text
                      margin="0"
                      style={{
                        ...theme.typography.body2,
                        color: theme.palette.grey[600],
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {repo.key_contributions}
                    </Text>
                  ) : null}
                  <Flex.Row
                    align="center"
                    justify="space-between"
                    wrap="wrap"
                    gap="0.5rem"
                    style={{ width: '100%' }}
                  >
                    <Text
                      style={{
                        ...theme.typography.caption,
                        color: theme.palette.grey[500],
                        margin: 0,
                        flex: '0 1 auto',
                        minWidth: 0,
                      }}
                    >
                      {formatRepositoryDisplayDateRange(repo)}
                    </Text>
                    {(formatRepoStat(repo.commit_count) != null ||
                      formatRepoStat(repo.stargazers_count) != null ||
                      formatRepoStat(repo.forks_count) != null) && (
                      <RepoStatPills
                        isMobile={isMobile}
                        stats={{
                          commit_count: repo.commit_count,
                          stargazers_count: repo.stargazers_count,
                          forks_count: repo.forks_count,
                        }}
                      />
                    )}
                  </Flex.Row>
                  {repo.languageBreakdown &&
                  repo.languageBreakdown.length > 0 ? (
                    <RepoLanguageBar breakdown={repo.languageBreakdown} />
                  ) : (
                    repo.languages.length > 0 && (
                      <Flex.Row gap="0.5rem" wrap="wrap">
                        {repo.languages.map(lang => (
                          <S.LangTag key={lang}>{lang}</S.LangTag>
                        ))}
                      </Flex.Row>
                    )
                  )}
                </Flex.Column>
              )}
            </S.Card>
          );
        })}
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
  Grid: styled('div')<{ $isMobile?: boolean }>`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
  `,
  Card: styled('div')<{ $isMobile?: boolean }>`
    flex: ${({ $isMobile }) =>
      $isMobile ? '1 1 100%' : '0 1 calc(50% - 0.5rem)'};
    max-width: ${({ $isMobile }) =>
      $isMobile ? '100%' : 'calc(50% - 0.5rem)'};
    min-width: 0;
    padding: 1.25rem;
    border-radius: 0.75rem;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border: 1px solid ${({ theme }) => theme.palette.grey[200]};
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    &:hover {
      border-color: ${({ theme }) => theme.palette.grey[300]};
      box-shadow: 0 2px 6px rgba(16, 24, 40, 0.08);
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
  EditButton: styled('button')`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem;
    border: none;
    border-radius: 0.375rem;
    background: none;
    color: ${palette.grey500};
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s ease, background-color 0.2s ease;
    &:hover {
      color: ${palette.blue500};
      background-color: ${palette.blue300};
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
  FieldLabel: styled('span')`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.secondary};
    line-height: 1.2;
  `,
  IconGhostMini: styled('button')`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem;
    margin-top: 0.125rem;
    border: none;
    border-radius: 0.375rem;
    background: none;
    color: ${palette.grey500};
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s ease, background-color 0.2s ease;
    &:hover {
      color: ${palette.blue500};
      background-color: ${palette.blue300};
    }
  `,
  TeamChip: styled('span')`
    display: inline-flex;
    align-items: center;
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
};
