import { Flex, Text } from '@/components';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { styled, useTheme } from '@mui/material';

/** 마일리지 정보. 추후 POST/PUT/DELETE /api/portfolio/mileage (mileage_id, additional_info) 연동 */
const MileageSectionContent = () => {
  const theme = useTheme();
  const items = [
    {
      semester: '2024-02',
      category: '전공',
      item: '선형대수학',
      additional_info: '',
    },
    {
      semester: '2024-01',
      category: '비교과',
      item: 'PPS Camp / 나의첫웹서비스',
      additional_info: '상세 설명 (유저 추가)',
    },
  ];

  return (
    <S.List>
      {items.map((row, i) => (
        <S.Row
          key={i}
          align="center"
          justify="space-between"
          wrap="wrap"
          gap="0.5rem"
        >
          <Flex.Row
            gap="0.75rem"
            align="center"
            wrap="wrap"
            style={{ minWidth: 0, flex: 1 }}
          >
            <Text
              style={{
                ...theme.typography.body2,
                color: theme.palette.grey[600],
                flexShrink: 0,
              }}
            >
              {row.semester}
            </Text>
            <Text
              style={{ ...theme.typography.body2, flexShrink: 0 }}
            >
              {row.category}
            </Text>
            <Text style={{ ...theme.typography.body2, minWidth: 0 }}>
              {row.item}
            </Text>
            {row.additional_info !== '' && (
              <Text
                style={{
                  ...theme.typography.body2,
                  color: theme.palette.grey[600],
                  minWidth: 0,
                }}
              >
                {row.additional_info}
              </Text>
            )}
          </Flex.Row>
          <VisibilityOutlinedIcon
            sx={{ fontSize: 18, color: '#537FF1', flexShrink: 0 }}
          />
        </S.Row>
      ))}
    </S.List>
  );
};

export default MileageSectionContent;

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
