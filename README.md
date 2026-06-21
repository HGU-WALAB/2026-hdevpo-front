# 2025 Mileage Front

한동대학교 전산전자공학부 마일리지 장학금 신청 서비스 프론트엔드입니다.

학생은 마일리지 현황을 확인하고, 장학금 신청 기간에 장학금을 신청할 수 있습니다. 포트폴리오 편집, GitHub 연동, CV 생성/관리/공유 기능도 포함합니다.

## 기술 스택

- React 18, TypeScript, Vite
- React Router, TanStack Query, Zustand
- Emotion, MUI, Nivo chart
- Axios, MSW
- Storybook, Chromatic
- Sentry, Amplitude

## 시작하기

```bash
yarn install
yarn dev
```

Mock API로 실행하려면 다음 명령을 사용합니다.

```bash
yarn dev:msw
```

빌드와 정적 검사는 다음 명령으로 확인합니다.

```bash
yarn lint
yarn build
```

Storybook은 다음 명령으로 실행합니다.

```bash
yarn storybook
```

## 주요 스크립트

- `yarn dev`: Vite 개발 서버 실행
- `yarn dev:msw`: MSW Mock API와 함께 개발 서버 실행
- `yarn build`: TypeScript build와 Vite production build 실행
- `yarn lint`: ESLint 실행
- `yarn preview`: production build 미리보기
- `yarn storybook`: Storybook 실행
- `yarn build-storybook`: Storybook build
- `yarn chromatic`: Chromatic 실행

## 환경 변수

현재 `.env.example`은 없습니다. 실제 값은 별도 보안 채널로 전달해야 합니다.

- `VITE_API_URL`: API 서버 base URL
- `VITE_API_MODE`: `msw`로 설정하면 Mock API 사용
- `VITE_SENTRY_DSN_TOKEN`: Sentry 브라우저 SDK DSN
- `VITE_AMPLITUDE_API_KEY`: Amplitude API key

운영 경로는 `/milestone25/` 기준입니다. 배포 경로를 변경하면 `vite.config.ts`, `src/router.tsx`, `src/main.tsx`의 MSW worker 경로를 함께 확인해야 합니다.

## 프로젝트 구조

```text
src/
├── main.tsx
├── App.tsx
├── router.tsx
├── apis/
├── assets/
├── components/
├── constants/
├── data/
├── mocks/
├── pages/
├── service/
├── shared/
├── stores/
├── styles/
├── types/
└── utils/
```

- `src/apis`: 공통 Axios 인스턴스, HTTP 래퍼, endpoint 상수
- `src/components`: 공통 UI, 레이아웃, 에러/로딩 컴포넌트
- `src/pages`: 기능/도메인별 페이지, API, hook, type, component
- `src/mocks`: MSW handler와 fixture
- `src/shared/hooks`: 공통 custom hook
- `src/stores`: Zustand 전역 상태
- `src/styles`: theme, palette, typography, global/reset style

## 인수인계 문서

프로젝트 실행, 구조, API, 데모 시나리오, 알려진 이슈는 아래 문서를 참고하세요.

- [HANDOFF.md](HANDOFF.md): 전체 인수인계 개요
- [docs/feature-map.md](docs/feature-map.md): 기능별 코드 맵
- [docs/demo-scenario.md](docs/demo-scenario.md): 시연 및 smoke test 시나리오
- [docs/api-map.md](docs/api-map.md): API 계약과 백엔드 의존성
- [docs/known-issues.md](docs/known-issues.md): 알려진 이슈와 후속 작업

## AI 작업 규칙

- [CLAUDE.md](CLAUDE.md): Claude용 프로젝트 작업 규칙
- [.cursor/rules/project-conventions.mdc](.cursor/rules/project-conventions.mdc): Cursor 전역 규칙
