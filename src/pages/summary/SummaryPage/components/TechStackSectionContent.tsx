import { Flex } from '@/components';
import { palette } from '@/styles/palette';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback, useState } from 'react';
import { styled } from '@mui/material';

/** 기술 스택. 추후 PUT /api/portfolio/tech-stack (tech_stack) 연동 */
const INITIAL_TAGS = ['Java', 'Spring Boot', 'TypeScript', 'React'];

const TechStackSectionContent = () => {
  const [tags, setTags] = useState<string[]>(INITIAL_TAGS);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleDelete = useCallback((index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAdd = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed !== '' && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setInputValue('');
      setIsAdding(false);
    } else if (trimmed === '') {
      setIsAdding(false);
      setInputValue('');
    }
  }, [inputValue, tags]);

  const handleAddKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAdd();
      }
      if (e.key === 'Escape') {
        setIsAdding(false);
        setInputValue('');
      }
    },
    [handleAdd],
  );

  return (
    <Flex.Row gap="0.5rem" wrap="wrap" align="center">
      {tags.map((name, index) => (
        <S.Tag key={`${name}-${index}`}>
          <span>{name}</span>
          <S.RemoveButton
            type="button"
            onClick={() => handleDelete(index)}
            aria-label={`${name} 삭제`}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </S.RemoveButton>
        </S.Tag>
      ))}
      {isAdding ? (
        <S.AddInput
          autoFocus
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={handleAdd}
          onKeyDown={handleAddKeyDown}
          placeholder="추가할 기술"
          maxLength={30}
        />
      ) : (
        <S.AddButton type="button" onClick={() => setIsAdding(true)}>
          + 추가
        </S.AddButton>
      )}
    </Flex.Row>
  );
};

export default TechStackSectionContent;

const S = {
  Tag: styled('span')`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 999px;
    background-color: ${palette.white};
    color: ${palette.blue500};
    border: 1.5px solid ${palette.blue400};
    ${({ theme }) => theme.typography.body2};
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(83, 127, 241, 0.08);
  `,
  RemoveButton: styled('button')`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
    color: ${palette.grey600};
    border-radius: 50%;
    &:hover {
      color: ${palette.blue700};
      background-color: rgba(0, 0, 0, 0.05);
    }
  `,
  AddButton: styled('button')`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    border: 1.5px dashed ${palette.grey300};
    background: transparent;
    color: ${palette.grey500};
    cursor: pointer;
    ${({ theme }) => theme.typography.body2};
    font-size: 0.875rem;
    &:hover {
      border-color: ${palette.blue400};
      color: ${palette.blue500};
    }
  `,
  AddInput: styled('input')`
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    border: 1.5px solid ${palette.blue400};
    min-width: 7rem;
    ${({ theme }) => theme.typography.body2};
    font-size: 0.875rem;
    outline: none;
    &:focus {
      border-color: ${palette.blue500};
      box-shadow: 0 0 0 2px ${palette.blue300};
    }
  `,
};
