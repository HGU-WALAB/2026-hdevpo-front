import { Flex } from '@/components';
import { Skeleton, styled } from '@mui/material';

const PortfolioSectionSkeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <Flex.Column gap="0.5rem">
      {[...Array(rows)].map((_, i) => (
        <S.Row key={i}>
          <Flex.Row gap="0.5rem" align="center">
            <Skeleton variant="text" width={64} height={20} />
            <Skeleton
              variant="rounded"
              width={70}
              height={22}
              style={{ borderRadius: '999px' }}
            />
            <Skeleton variant="text" width="35%" height={20} />
          </Flex.Row>
          <Skeleton variant="text" width="60%" height={18} />
        </S.Row>
      ))}
    </Flex.Column>
  );
};

export default PortfolioSectionSkeleton;

const S = {
  Row: styled(Flex.Column)`
    padding: 0.75rem 1rem;
    gap: 0.375rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.palette.grey[200]};
  `,
};
