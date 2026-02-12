import { Flex, Text } from '@/components';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material';

/** 유저정보. 추후 PATCH /api/portfolio/user-info (bio) 연동 */
const UserInfoSectionContent = () => {
  const theme = useTheme();

  return (
    <S.Container gap="1rem" align="flex-start">
      <Flex.Row gap="1rem" align="center" wrap="wrap">
        <S.Avatar />
        <Flex.Column gap="0.25rem" style={{ minWidth: 0, flex: 1 }}>
          <Text style={{ ...theme.typography.h6, fontWeight: 700 }}>
            홍길동
          </Text>
          <Text
            style={{
              ...theme.typography.body2,
              color: theme.palette.grey[600],
            }}
          >
            전공1 / 전공2
          </Text>
          <Text
            style={{
              ...theme.typography.body2,
              marginTop: '0.25rem',
            }}
          >
            About me (유저가 추가)
          </Text>
        </Flex.Column>
      </Flex.Row>
    </S.Container>
  );
};

export default UserInfoSectionContent;

const S = {
  Container: styled(Flex.Column)``,
  Avatar: styled('div')`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.palette.grey[300]};
    flex-shrink: 0;
  `,
};
