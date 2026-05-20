const STYLE_TAG =
  '<style data-devpo-scrollbar="hide">html,body{scrollbar-width:none;-ms-overflow-style:none;}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;}</style>';

/**
 * iframe `srcDoc`용 HTML 문서에 스크롤바 숨김 스타일을 한 번만 삽입합니다.
 */
export function appendHideScrollbarStyleToSrcDocHtml(html: string): string {
  const t = html.trim();
  if (!t) return t;
  if (t.includes('data-devpo-scrollbar="hide"')) return t;
  if (/<head\b[^>]*>/i.test(t)) {
    return t.replace(/<head\b[^>]*>/i, m => `${m}${STYLE_TAG}`);
  }
  if (/<html\b[^>]*>/i.test(t)) {
    return t.replace(/<html\b[^>]*>/i, m => `${m}<head>${STYLE_TAG}</head>`);
  }
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"/>${STYLE_TAG}</head><body>${t}</body></html>`;
}
