import { Flex, Text } from '@/components';
import { boxShadow } from '@/styles/common';
import ComputerIcon from '@mui/icons-material/ComputerOutlined';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material';

/** 유저정보. 상단 고정, 타이틀 없음. 추후 PATCH /api/portfolio/user-info (bio) 연동 */
const UserInfoSectionContent = () => {
  const theme = useTheme();

  return (
    <S.Card>
      <S.Inner>
        <S.Avatar />
        <Flex.Column gap="0.375rem" style={{ minWidth: 0, flex: 1 }}>
          <Text
            style={{
              ...theme.typography.h5,
              fontWeight: 700,
              fontSize: '1.5rem',
              lineHeight: 1.4,
            }}
          >
            홍길동 (김길동)
          </Text>
          <Flex.Row align="center" gap="0.5rem" wrap="wrap">
            <Text
              style={{
                ...theme.typography.body1,
                color: theme.palette.grey[600],
                fontSize: '1.125rem',
              }}
            >
              CS student
            </Text>
            <ComputerIcon
              sx={{ fontSize: 22, color: theme.palette.primary.main }}
            />
          </Flex.Row>
          <Text
            style={{
              ...theme.typography.body1,
              color: theme.palette.grey[600],
              fontSize: '1.0625rem',
            }}
          >
            전공1 / 전공2
          </Text>
        </Flex.Column>
      </S.Inner>
    </S.Card>
  );
};

export default UserInfoSectionContent;

const S = {
  Card: styled('section')`
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 0.75rem;
    padding: 1.25rem;
    width: 100%;
    ${boxShadow};
  `,
  Inner: styled(Flex.Row)`
    gap: 1.25rem;
    align-items: flex-start;
    flex-wrap: wrap;
  `,
  Avatar: styled('div')`
    width: 6rem;
    height: 6rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.palette.grey[300]};
    flex-shrink: 0;
  `,
};
