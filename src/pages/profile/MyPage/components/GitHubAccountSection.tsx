import { Flex, Heading, Text } from '@/components';
import LinkIcon from '@mui/icons-material/Link';
import { styled, useTheme } from '@mui/material';

const GitHubAccountSection = () => {
  const theme = useTheme();

  const handleConnect = () => {
    // TODO: GitHub 연결 API 구현 시 추가
    console.log('GitHub 연결');
  };

  return (
    <S.Container>
      <Flex.Row justify="space-between" align="center" margin="0 0 1rem">
        <Flex.Row align="center" gap="0.75rem" style={{ flex: 1 }}>
          <Heading
            as="h3"
            style={{
              fontWeight: 700,
              margin: 0,
              fontSize: '1.125rem',
              lineHeight: '1.5',
            }}
          >
            Github 계정
          </Heading>
          <Text
            style={{
              ...theme.typography.body2,
              color: theme.palette.grey[500],
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
          >
            * 개인 계정을 연결하여 추가 기능을 사용할 수 있습니다.
          </Text>
        </Flex.Row>
        <S.ConnectButton onClick={handleConnect}>
          <LinkIcon sx={{ fontSize: 20 }} />
          <Text
            style={{
              ...theme.typography.body2,
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            연결
          </Text>
        </S.ConnectButton>
      </Flex.Row>

      <S.InfoRow>
        <S.LabelWrapper>
          <Text
            style={{
              ...theme.typography.body2,
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: '1.5',
            }}
          >
            아이디
          </Text>
        </S.LabelWrapper>
        <Text
          style={{
            ...theme.typography.body2,
            color: '#999999',
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: '1.5',
          }}
        >
          연결되지 않음
        </Text>
      </S.InfoRow>
    </S.Container>
  );
};

export default GitHubAccountSection;

const S = {
  Container: styled(Flex.Column)`
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 0.75rem;
    padding: 1.25rem;
    width: 100%;
  `,
  ConnectButton: styled(Flex.Row)`
    align-items: center;
    gap: 0.375rem;
    color: ${({ theme }) => theme.palette.primary.main};
    cursor: pointer;
    white-space: nowrap;
    &:hover {
      opacity: 0.8;
    }
  `,
  LabelWrapper: styled('div')`
    width: 5rem;
    flex-shrink: 0;
  `,
  InfoRow: styled(Flex.Row)`
    align-items: center;
    padding: 0.875rem 0;
    gap: 1.5rem;
  `,
};

