import { Flex, Heading } from '@/components';
import { boxShadow } from '@/styles/common';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { styled, useTheme } from '@mui/material';
import {
  type DragEvent,
  type ReactNode,
  useCallback,
} from 'react';

import type { SectionOrderKey } from '../../constants/constants';

interface DraggableSectionProps {
  sectionId: SectionOrderKey;
  title: string;
  icon?: ReactNode;
  onDragStart: (id: SectionOrderKey) => void;
  onDragOver: (e: DragEvent<HTMLElement>, targetId: SectionOrderKey) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (targetId: SectionOrderKey) => void;
  isDragOver?: boolean;
  children: ReactNode;
}

const DraggableSection = ({
  sectionId,
  title,
  icon,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver = false,
  children,
}: DraggableSectionProps) => {
  const theme = useTheme();

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.dataTransfer.setData('sectionId', sectionId);
      e.dataTransfer.effectAllowed = 'move';
      onDragStart(sectionId);
    },
    [sectionId, onDragStart],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      onDragOver(e, sectionId);
    },
    [sectionId, onDragOver],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      onDrop(sectionId);
    },
    [sectionId, onDrop],
  );

  return (
    <S.Section
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      $isDragOver={isDragOver}
    >
      <S.Header align="center" gap="0.5rem">
        <S.DragHandle
          onMouseDown={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
        >
          <DragIndicatorIcon
            sx={{ fontSize: 20, color: theme.palette.grey[500] }}
          />
        </S.DragHandle>
        {icon != null && <S.IconWrap>{icon}</S.IconWrap>}
        <Heading
          as="h3"
          style={{
            fontWeight: 700,
            margin: 0,
            fontSize: '1.125rem',
            lineHeight: '1.5',
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Heading>
      </S.Header>
      <S.Content>{children}</S.Content>
    </S.Section>
  );
};

export default DraggableSection;

const S = {
  Section: styled('section')<{ $isDragOver?: boolean }>`
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 0.75rem;
    padding: 1.25rem;
    width: 100%;
    ${boxShadow};
    opacity: ${({ $isDragOver }) => ($isDragOver ? 0.85 : 1)};
    transition: opacity 0.15s ease;
  `,
  Header: styled(Flex.Row)`
    margin-bottom: 1rem;
  `,
  DragHandle: styled('div')`
    cursor: grab;
    display: flex;
    align-items: center;
    &:active {
      cursor: grabbing;
    }
  `,
  IconWrap: styled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  Content: styled('div')`
    width: 100%;
  `,
};
