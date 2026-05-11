/**
 * overflow 스크롤은 유지하고 스크롤바만 숨김 (Firefox / IE 계열 / WebKit).
 * MUI `sx` 또는 styled `({ theme }) => ({ ... })` 안에 spread 해서 사용합니다.
 */
export const hideScrollbar = {
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
  '&::-webkit-scrollbar': { display: 'none' as const },
} as const;
