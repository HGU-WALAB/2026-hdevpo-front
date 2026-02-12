import { Flex, Text } from '@/components';
import { MAX_RESPONSIVE_WIDTH } from '@/constants/system';
import { boxShadow } from '@/styles/common';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { styled, useTheme, useMediaQuery } from '@mui/material';

/** 깃허브 레포지토리. 추후 PUT /api/portfolio/repositories (repo_id, custom_title, is_visible) 연동 */
const RepoSectionContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(MAX_RESPONSIVE_WIDTH);
  const repos = [
    {
      repo_id: 1,
      name: 'web-camp-2026',
      custom_title: null,
      description: 'No description',
      created_at: '2025-01-01',
      updated_at: '2025-02-01',
      languages: ['TypeScript', 'HTML'],
    },
    {
      repo_id: 2,
      name: 'phenotype-viewer',
      custom_title: null,
      description: '이미지 파일과 예측 값 간의 대응 관계 제공',
      created_at: '2024-06-01',
      updated_at: '2025-01-15',
      languages: ['Java'],
    },
  ];

  return (
    <Flex.Column gap="1rem">
      <S.Grid $isMobile={isMobile}>
        {repos.map(repo => (
          <S.Card key={repo.repo_id} $isMobile={isMobile}>
            <Flex.Row justify="flex-end" style={{ marginBottom: '0.25rem' }}>
              <VisibilityOutlinedIcon
                sx={{ fontSize: 18, color: '#537FF1' }}
              />
            </Flex.Row>
            <Flex.Column gap="0.5rem">
              <S.RepoLink href="#">{repo.name}</S.RepoLink>
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
    </Flex.Column>
  );
};

export default RepoSectionContent;

const S = {
  Grid: styled('div')<{ $isMobile?: boolean }>`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
  `,
  Card: styled('div')<{ $isMobile?: boolean }>`
    flex: ${({ $isMobile }) => ($isMobile ? '1 1 100%' : '1 1 18rem')};
    min-width: 0;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.palette.background.default};
    ${boxShadow};
  `,
  RepoLink: styled('a')`
    ${({ theme }) => theme.typography.body1};
    font-weight: 600;
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: underline;
    &:hover {
      opacity: 0.9;
    }
  `,
  LangTag: styled('span')`
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.palette.grey[200]};
    ${({ theme }) => theme.typography.caption};
    font-size: 0.75rem;
  `,
};
