import { Flex, Footer } from '@/components';
import { useTrackPageView } from '@/service/amplitude/useTrackPageView';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FolderIcon from '@mui/icons-material/Folder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import { useCallback, useState } from 'react';

import {
  DEFAULT_SECTION_ORDER,
  SECTION_TITLES,
  type SectionOrderKey,
} from '../constants/constants';
import {
  ActivitiesSectionContent,
  DraggableSection,
  MileageSectionContent,
  RepoSectionContent,
  TechStackSectionContent,
  UserInfoSectionContent,
} from './components';

const SECTION_ICONS: Record<SectionOrderKey, React.ReactNode> = {
  user_info: <PersonIcon sx={{ fontSize: 20, color: '#537FF1' }} />,
  tech_stack: <CodeIcon sx={{ fontSize: 20, color: '#537FF1' }} />,
  repo: <FolderIcon sx={{ fontSize: 20, color: '#537FF1' }} />,
  mileage: <MenuBookIcon sx={{ fontSize: 20, color: '#537FF1' }} />,
  activities: <EmojiEventsIcon sx={{ fontSize: 20, color: '#537FF1' }} />,
};

const SummaryPage = () => {
  useTrackPageView({ eventName: '[View] 활동 요약' });
  const [sectionOrder, setSectionOrder] = useState<SectionOrderKey[]>(
    DEFAULT_SECTION_ORDER,
  );
  const [draggedId, setDraggedId] = useState<SectionOrderKey | null>(null);
  const [dragOverId, setDragOverId] = useState<SectionOrderKey | null>(null);

  const handleDragStart = useCallback((id: SectionOrderKey) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback(
    (_e: React.DragEvent<HTMLElement>, targetId: SectionOrderKey) => {
      setDragOverId(targetId);
    },
    [],
  );

  const handleDragLeave = useCallback((_e: React.DragEvent<HTMLElement>) => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (targetId: SectionOrderKey) => {
      if (draggedId == null || draggedId === targetId) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }
      const fromIdx = sectionOrder.indexOf(draggedId);
      const toIdx = sectionOrder.indexOf(targetId);
      if (fromIdx === -1 || toIdx === -1) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }
      const next = [...sectionOrder];
      const [removed] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, removed);
      setSectionOrder(next);
      setDraggedId(null);
      setDragOverId(null);
    },
    [draggedId, sectionOrder],
  );

  const renderSectionContent = (key: SectionOrderKey) => {
    switch (key) {
      case 'user_info':
        return <UserInfoSectionContent />;
      case 'tech_stack':
        return <TechStackSectionContent />;
      case 'repo':
        return <RepoSectionContent />;
      case 'mileage':
        return <MileageSectionContent />;
      case 'activities':
        return <ActivitiesSectionContent />;
      default:
        return null;
    }
  };

  return (
    <Flex.Column margin="1rem" gap="1.5rem">
      <Flex.Column gap="1rem">
        {sectionOrder.map(key => (
          <DraggableSection
            key={key}
            sectionId={key}
            title={SECTION_TITLES[key]}
            icon={SECTION_ICONS[key]}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            isDragOver={dragOverId === key}
          >
            {renderSectionContent(key)}
          </DraggableSection>
        ))}
      </Flex.Column>
      <Footer />
    </Flex.Column>
  );
};

export default SummaryPage;
