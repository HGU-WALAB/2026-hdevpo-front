import { Flex, Heading } from '@/components';
import { boxShadow } from '@/styles/common';
import { styled, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

interface StaticSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

const StaticSection = ({ title, icon, children }: StaticSectionProps) => {
  const theme = useTheme();

  return (
    <S.Section>
      <S.Header align="center" gap="0.5rem">
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

export default StaticSection;

const S = {
  Section: styled('section')`
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 0.75rem;
    padding: 1.25rem;
    width: 100%;
    ${boxShadow};
  `,
  Header: styled(Flex.Row)`
    margin-bottom: 1rem;
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
