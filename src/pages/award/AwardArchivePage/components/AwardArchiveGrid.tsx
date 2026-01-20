import { MAX_RESPONSIVE_WIDTH } from '@/constants/system';
import { styled, useMediaQuery } from '@mui/material';

import { AWARD_TYPES } from '../../constants/awardTypeLabels';
import { useGroupedAwardList } from '../../hooks/useGroupedAwardList';

import { ROUTE_PATH } from '@/constants/routePath';
import { useNavigate, useLocation } from 'react-router-dom';
import { AwardCountBox } from './AwardCountBox';
import { AwardPageForwardButton } from './AwardPageForwardButton';

interface Props {
  showForwardButton?: boolean;
}

export const AwardArchiveGrid = ({ showForwardButton = true }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(MAX_RESPONSIVE_WIDTH);
  const { groupedAwardList } = useGroupedAwardList();

  const filledAwardList = AWARD_TYPES.map(type => {
    const found = groupedAwardList.find(g => g.awardType === type);
    return found ?? { awardType: type, items: [] };
  });

  const isAwardPage = location.pathname === ROUTE_PATH.awardArchive;

  return (
    <S.GridLayout isMobile={isMobile}>
      {filledAwardList.map(group => (
        <AwardCountBox
          key={group.awardType}
          awardType={group.awardType}
          length={group.items.length}
          onClick={() =>
            navigate(
              `${ROUTE_PATH.awardArchive}?awardType=${group.awardType}&awardYear=전체`,
            )
          }
        />
      ))}

      {showForwardButton && !isAwardPage && (
        <S.ForwardButtonWrapper className="forwardButton">
          <AwardPageForwardButton />
        </S.ForwardButtonWrapper>
      )}
    </S.GridLayout>
  );
};

const S = {
  GridLayout: styled('div')<{ isMobile: boolean }>`
    display: grid;
    gap: 1rem;
    grid-template-columns: ${({ isMobile }) =>
      isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'};

    ${({ isMobile }) =>
      isMobile &&
      `
        & > .forwardButton {
          grid-column: span 2;
        }
      `}
  `,
  ForwardButtonWrapper: styled('div')``,
};
