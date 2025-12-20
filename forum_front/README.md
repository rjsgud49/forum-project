# 게시판 프론트엔드

Next.js, TypeScript, Tailwind CSS, Redux Toolkit을 사용한 게시판 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 주요 기능

- ✅ Velog 스타일의 깔끔한 메인 페이지
- ✅ 로그인/회원가입 모달
- ✅ 게시글 목록 조회
- ✅ 게시글 상세 조회
- ✅ 게시글 작성 (인증 필요)
- ✅ 게시글 수정 (작성자만 가능)
- ✅ 게시글 삭제 (작성자만 가능)
- ✅ 내 게시글 목록 조회
- ✅ JWT 토큰 기반 인증

## 프로젝트 구조

```
gesipan/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지
│   ├── posts/             # 게시글 관련 페이지
│   └── my-posts/          # 내 게시글 페이지
├── components/            # React 컴포넌트
│   ├── Header.tsx         # 헤더 컴포넌트
│   ├── Hero.tsx           # 히어로 섹션
│   ├── PostList.tsx       # 게시글 목록
│   ├── LoginModal.tsx     # 로그인 모달
│   └── ReduxProvider.tsx  # Redux Provider
├── store/                 # Redux Store
│   ├── store.ts           # Store 설정
│   └── slices/            # Redux Slices
│       └── authSlice.ts   # 인증 상태 관리
├── services/              # API 서비스
│   └── api.ts             # API 클라이언트
└── types/                 # TypeScript 타입
    └── api.ts             # API 타입 정의
```

## 백엔드 연동

백엔드 서버는 `http://localhost:8081`에서 실행되어야 합니다.

백엔드의 CORS 설정이 `http://localhost:5174`로 되어 있다면, Next.js 개발 서버 포트를 변경하거나 백엔드 CORS 설정을 업데이트해야 합니다.

## API 엔드포인트

### 인증
- `POST /auth/login` - 로그인
- `POST /auth/register` - 회원가입

### 게시글
- `GET /api/post` - 전체 게시글 목록
- `GET /api/post/my-post` - 내 게시글 목록
- `GET /api/post/{id}` - 게시글 상세
- `POST /api/post` - 게시글 작성
- `PATCH /api/post/{id}` - 게시글 수정
- `DELETE /api/post/{id}` - 게시글 삭제

