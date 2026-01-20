import { Flex } from '@/components';
import { LineChartSection, RadarChartSection } from '.';
import { MAX_RESPONSIVE_WIDTH } from '@/constants/system';
import { useMediaQuery } from '@mui/material';

const ChartSection = () => {
  const isMobile = useMediaQuery(MAX_RESPONSIVE_WIDTH);

  return (
    <Flex.Row
      height="fit-content"
      width="100%"
      justify="center"
      gap="1rem"
      wrap={isMobile ? 'wrap' : 'nowrap'}
    >
      <RadarChartSection />
      <LineChartSection />
    </Flex.Row>
  );
};

export default ChartSection;
