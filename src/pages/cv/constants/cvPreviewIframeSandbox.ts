/**
 * CV/포트폴리오 HTML `srcDoc` 미리보기용 iframe sandbox.
 *
 * ⚠️ `allow-scripts` + `allow-same-origin` 동시 사용 금지.
 *    두 플래그가 함께 있으면 iframe 내 스크립트가 sandbox 속성을 제거하고
 *    부모 페이지 DOM에 완전히 접근할 수 있어 sandbox가 무력화됨 (MDN 경고).
 *
 * - `allow-scripts`     → 우리가 주입한 링크 오프너 스크립트 실행 허용.
 *                         DOMPurify가 사용자 <script>·이벤트 핸들러를 제거하므로
 *                         실행되는 스크립트는 buildCvPreviewSrcDoc이 주입한 것뿐.
 *                         allow-same-origin 없이 cross-origin(null origin)으로 동작하므로
 *                         iframe 스크립트는 window.parent.document에 접근 불가.
 * - `allow-downloads`   → PDF 등 다운로드 허용.
 *
 * window.parent.open()은 HTML 스펙상 cross-origin window에서도 허용되는 메서드이므로
 * allow-same-origin 없이도 링크를 새 탭으로 여는 동작이 정상 작동함.
 */
export const CV_PREVIEW_IFRAME_SANDBOX = 'allow-scripts allow-downloads';
