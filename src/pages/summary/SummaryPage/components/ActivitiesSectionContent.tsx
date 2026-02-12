import { Flex, Text } from '@/components';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { styled, useTheme } from '@mui/material';

/** 활동. 추후 POST/PUT/DELETE /api/portfolio/activities (title, description, start_date, end_date) 연동 */
const ActivitiesSectionContent = () => {
  const theme = useTheme();
  const activities = [
    {
      title: '교내 해커톤 대상',
      start_date: '2024-01-01',
      end_date: '2024-06-30',
      description: '소프트웨어 중심대학',
    },
  ];

  return (
    <S.List>
      {activities.map((a, i) => (
        <S.Row
          key={i}
          align="flex-start"
          justify="space-between"
          wrap="wrap"
          gap="0.5rem"
        >
          <Flex.Column gap="0.25rem" style={{ minWidth: 0, flex: 1 }}>
            <Text style={{ ...theme.typography.body1, fontWeight: 600 }}>
              {a.title}
            </Text>
            <Text
              style={{
                ...theme.typography.body2,
                color: theme.palette.grey[600],
              }}
            >
              {a.description}
            </Text>
            <Text
              style={{
                ...theme.typography.caption,
                color: theme.palette.grey[500],
              }}
            >
              {a.start_date} ~ {a.end_date}
            </Text>
          </Flex.Column>
          <VisibilityOutlinedIcon
            sx={{ fontSize: 18, color: '#537FF1', flexShrink: 0 }}
          />
        </S.Row>
      ))}
    </S.List>
  );
};

export default ActivitiesSectionContent;

const S = {
  List: styled(Flex.Column)`
    gap: 0;
  `,
  Row: styled(Flex.Row)`
    padding: 0.75rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[200]};
    &:last-of-type {
      border-bottom: none;
    }
  `,
};
