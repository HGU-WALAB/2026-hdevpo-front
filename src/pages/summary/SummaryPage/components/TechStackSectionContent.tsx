import { Flex } from '@/components';
import { styled } from '@mui/material';

/** 기술 스택. 추후 PUT /api/portfolio/tech-stack (tech_stack) 연동 */
const TechStackSectionContent = () => {
  const tags = ['Java', 'Spring Boot', 'TypeScript', 'React'];

  return (
    <Flex.Row gap="0.5rem" wrap="wrap">
      {tags.map(name => (
        <S.Tag key={name}>{name}</S.Tag>
      ))}
    </Flex.Row>
  );
};

export default TechStackSectionContent;

const S = {
  Tag: styled('span')`
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.palette.grey[200]};
    color: ${({ theme }) => theme.palette.text.primary};
    ${({ theme }) => theme.typography.body2};
    font-size: 0.875rem;
  `,
};
