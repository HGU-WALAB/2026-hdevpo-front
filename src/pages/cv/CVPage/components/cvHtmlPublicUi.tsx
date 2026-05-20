import { Button, Text } from '@/components';
import { palette } from '@/styles/palette';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  useLayoutEffect,
  useRef,
  useState,
  type FunctionComponent,
  type SVGProps,
} from 'react';

import type { Size } from '@/types/style';
import { CV_PREVIEW_IFRAME_SANDBOX } from '../../constants/cvPreviewIframeSandbox';

/** CV 생성 스텝2 취업 스위치와 동일 — @styles/palette */
export const htmlPublicSwitchSx: SxProps<Theme> = {
  ml: 0.25,
  mr: 0,
  flexShrink: 0,
  '& .MuiSwitch-thumb': {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: palette.white,
    '& + .MuiSwitch-track': {
      backgroundColor: palette.blue500,
      opacity: 1,
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: palette.grey300,
    opacity: 1,
  },
};

const OpenInNewSmall: FunctionComponent<SVGProps<SVGSVGElement>> = () => (
  <OpenInNewIcon sx={{ fontSize: 16 }} />
);
const OpenInNewMedium: FunctionComponent<SVGProps<SVGSVGElement>> = () => (
  <OpenInNewIcon sx={{ fontSize: 18 }} />
);

export type CvHtmlPublicLinkButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  /** 기본 `포토폴리오 보기` */
  label?: string;
};

export type CvHtmlPublicAppearance = 'filled' | 'plain';

/** 썸네일 박스 한 변 (px) */
const THUMB_PX = 88;
/** iframe 렌더 기준 크기 — A4 비율에 가깝게 두고 scale로 축소 */
const IFRAME_W = 720;
const IFRAME_H = 1020;
const THUMB_SCALE = Math.min(THUMB_PX / IFRAME_W, THUMB_PX / IFRAME_H);

/**
 * HTML 공개 — 1행: 상태 문구 + 스위치(항상 같은 줄), 2행: 공개 시 링크 버튼.
 * 포트폴리오 카드 / 미리보기 모달 공통.
 * @param appearance `filled`(기본) — 파란 톤 / `plain` — 흰 배경·목록 카드 안에서 사용
 */
export function CvHtmlPublicSwitchControl({
  isPublic,
  onPublicChange,
  disabled,
  size = 'small',
  linkButton,
  appearance = 'filled',
}: {
  isPublic: boolean;
  onPublicChange: (next: boolean) => void;
  disabled?: boolean;
  size?: Size;
  /** 공개 시에만 링크 버튼 표시 */
  linkButton?: CvHtmlPublicLinkButtonProps;
  appearance?: CvHtmlPublicAppearance;
}) {
  const LinkIcon = size === 'medium' ? OpenInNewMedium : OpenInNewSmall;
  const labelFs = size === 'medium' ? '0.8125rem' : '0.75rem';
  const isMedium = size === 'medium';
  const plain = appearance === 'plain';

  const headline = isPublic ? 'HTML 공개 중' : 'HTML 비공개';

  return (
    <S.Bar $medium={isMedium} $plain={plain}>
      <S.BarTopRow $medium={isMedium}>
        <Text
          margin="0"
          color={isPublic ? palette.blue600 : palette.grey600}
          style={{
            fontSize: labelFs,
            fontWeight: 600,
            lineHeight: 1.35,
            flex: '1 1 auto',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {headline}
        </Text>
        <Switch
          checked={Boolean(isPublic)}
          onChange={(_, checked) => onPublicChange(checked)}
          disabled={disabled}
          size="small"
          sx={{ ...(htmlPublicSwitchSx as object), flexShrink: 0 } as SxProps<Theme>}
          inputProps={{
            'aria-label': isPublic ? 'HTML 공개 끄기' : 'HTML 공개 켜기',
          }}
        />
      </S.BarTopRow>
      {linkButton && isPublic ? (
        <S.BarLinkRow>
          <Button
            label={linkButton.label ?? '링크 열기'}
            variant="outlined"
            color="blue"
            size={size}
            icon={LinkIcon}
            iconPosition="start"
            onClick={linkButton.onClick}
            disabled={linkButton.disabled}
          />
        </S.BarLinkRow>
      ) : null}
    </S.Bar>
  );
}

/** 왼쪽(제목·스위치·가이드) 넓게 + 오른쪽 HTML 미리보기(가로 고정·세로는 왼쪽 열 높이) */
export function CvHtmlPublicSettingsRow({
  title,
  guide,
  htmlPreviewSrcDoc,
  ...switchProps
}: {
  title?: string;
  guide?: string;
  htmlPreviewSrcDoc?: string | null;
  isPublic: boolean;
  onPublicChange: (next: boolean) => void;
  disabled?: boolean;
  size?: Size;
  linkButton?: CvHtmlPublicLinkButtonProps;
  appearance?: CvHtmlPublicAppearance;
}) {
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [thumbMatchHeightPx, setThumbMatchHeightPx] = useState(THUMB_PX);
  const { isPublic, linkButton } = switchProps;

  useLayoutEffect(() => {
    const el = leftColumnRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h <= 0) return;
      setThumbMatchHeightPx(Math.max(THUMB_PX, Math.ceil(h)));
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [title, guide, isPublic, linkButton != null]);

  return (
    <S.SettingsRow>
      <S.LeftColumn ref={leftColumnRef}>
        {title ? <S.SettingsTitle>{title}</S.SettingsTitle> : null}
        <CvHtmlPublicSwitchControl {...switchProps} />
        {guide ? (
          <S.SettingsGuide as="p" margin="0" color={palette.grey600}>
            {guide}
          </S.SettingsGuide>
        ) : null}
      </S.LeftColumn>
      <S.RightColumn>
        <CvHtmlPreviewThumb
          htmlPreviewSrcDoc={htmlPreviewSrcDoc}
          matchRowHeight
          matchLeftColumnHeightPx={thumbMatchHeightPx}
        />
      </S.RightColumn>
    </S.SettingsRow>
  );
}

/** 전체 레이아웃이 한눈에 보이도록 축소한 읽기 전용 HTML 미리보기 */
export function CvHtmlPreviewThumb({
  htmlPreviewSrcDoc,
  matchRowHeight = false,
  matchLeftColumnHeightPx,
}: {
  htmlPreviewSrcDoc?: string | null;
  /** true — 왼쪽 설정 열 높이 등에 맞춤 */
  matchRowHeight?: boolean;
  /** 설정 행: 가로는 고정(THUMB_PX), 세로만 왼쪽 열(제목·바·안내) 높이에 맞춤 */
  matchLeftColumnHeightPx?: number;
}) {
  const hasHtml = Boolean(htmlPreviewSrcDoc?.trim());
  const thumbRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(THUMB_SCALE);

  useLayoutEffect(() => {
    if (!matchRowHeight) {
      setScale(THUMB_SCALE);
      return;
    }
    const el = thumbRef.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      setScale(Math.min(w / IFRAME_W, h / IFRAME_H));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [matchRowHeight, htmlPreviewSrcDoc, matchLeftColumnHeightPx]);

  return (
    <S.PreviewThumb
      ref={thumbRef}
      $matchRowHeight={matchRowHeight}
      $matchHeightPx={matchLeftColumnHeightPx ?? null}
      aria-label="HTML 미리보기"
    >
      {hasHtml ? (
        <S.PreviewScaler $scale={scale}>
          <iframe
            title="HTML 미리보기"
            srcDoc={htmlPreviewSrcDoc ?? ''}
            sandbox={CV_PREVIEW_IFRAME_SANDBOX}
            referrerPolicy="no-referrer"
            tabIndex={-1}
            width={IFRAME_W}
            height={IFRAME_H}
          />
        </S.PreviewScaler>
      ) : (
        <S.PreviewEmpty>HTML 없음</S.PreviewEmpty>
      )}
    </S.PreviewThumb>
  );
}

const S = {
  SettingsRow: styled('div')`
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 0.75rem;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    @media (max-width: 480px) {
      grid-template-columns: minmax(0, 1fr);
    }
  `,
  LeftColumn: styled('div')`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-self: start;
    min-width: 0;
    max-width: 100%;
  `,
  SettingsGuide: styled(Text)`
    font-size: 0.75rem;
    line-height: 1.65;
    overflow-wrap: anywhere;
    word-break: keep-all;
    max-width: 100%;
  `,
  RightColumn: styled('div')`
    display: flex;
    flex: 0 0 ${THUMB_PX}px;
    width: ${THUMB_PX}px;
    flex-direction: column;
    align-self: start;
    justify-content: flex-start;
    min-height: 0;
    min-width: ${THUMB_PX}px;
    max-width: ${THUMB_PX}px;
  `,
  SettingsTitle: styled('span')`
    display: block;
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${palette.grey600};
  `,
  Bar: styled('div', {
    shouldForwardProp: p => p !== '$medium' && p !== '$plain',
  })<{ $medium: boolean; $plain: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.45rem;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    padding: 0.55rem 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid ${palette.grey200};
    background-color: ${({ $plain }) => ($plain ? palette.white : palette.blue300)};
    box-shadow: ${({ $plain }) =>
      $plain ? 'none' : '0 1px 2px rgba(83, 127, 241, 0.08)'};
    flex: 0 0 auto;
    align-self: flex-start;
  `,
  BarTopRow: styled('div', {
    shouldForwardProp: p => p !== '$medium',
  })<{ $medium?: boolean }>`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    width: 100%;
    min-width: 0;
    min-height: ${({ $medium }) =>
      $medium ? 'calc(0.55rem * 2 + 36px)' : 'calc(0.55rem * 2 + 30px)'};
  `,
  BarLinkRow: styled('div')`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    min-width: 0;
  `,
  PreviewThumb: styled('div', {
    shouldForwardProp: p => p !== '$matchRowHeight' && p !== '$matchHeightPx',
  })<{ $matchRowHeight: boolean; $matchHeightPx: number | null }>`
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid ${palette.grey200};
    background-color: ${palette.white};
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.08);
    ${({ $matchRowHeight, $matchHeightPx }) =>
      $matchRowHeight && $matchHeightPx != null
        ? `
    align-self: flex-start;
    flex-shrink: 0;
    width: ${THUMB_PX}px;
    height: ${$matchHeightPx}px;
    min-width: ${THUMB_PX}px;
    min-height: ${THUMB_PX}px;
    max-width: 100%;
    `
        : $matchRowHeight
          ? `
    align-self: flex-start;
    width: min(100%, 10rem);
    max-width: min(10rem, 36vw);
    height: auto;
    aspect-ratio: 1;
    min-width: ${THUMB_PX}px;
    min-height: ${THUMB_PX}px;
    max-height: min(10rem, 50vh);
    `
          : `
    width: ${THUMB_PX}px;
    height: ${THUMB_PX}px;
    min-width: ${THUMB_PX}px;
    min-height: ${THUMB_PX}px;
    `}
    @media (max-width: 480px) {
      ${({ $matchRowHeight, $matchHeightPx }) =>
        $matchRowHeight && $matchHeightPx != null
          ? `
      width: min(100%, ${THUMB_PX}px);
      height: ${$matchHeightPx}px;
      min-width: 0;
      min-height: ${THUMB_PX}px;
      `
          : `
      width: ${$matchRowHeight ? 'auto' : '100%'};
      max-width: ${THUMB_PX}px;
      min-width: 0;
      `}
    }
  `,
  PreviewScaler: styled('div', {
    shouldForwardProp: p => p !== '$scale',
  })<{ $scale: number }>`
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${IFRAME_W}px;
    height: ${IFRAME_H}px;
    transform: translate(-50%, -50%) scale(${({ $scale }) => $scale});
    transform-origin: center center;
    pointer-events: none;
    & > iframe {
      display: block;
      border: none;
      pointer-events: none;
    }
  `,
  PreviewEmpty: styled('span')`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0.25rem;
    box-sizing: border-box;
    font-size: 0.625rem;
    font-weight: 600;
    line-height: 1.35;
    text-align: center;
    color: ${palette.grey500};
  `,
};
