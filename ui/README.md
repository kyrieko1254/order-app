# COZY — 커피 주문 앱

React와 Vite를 사용하여 개발된 커피 주문 웹 애플리케이션입니다.

## 🚀 주요 기능

### 주문 화면

- **메뉴 선택**: 다양한 커피 메뉴 선택
- **옵션 선택**: 샷 추가, 시럽 추가 등 옵션 선택
- **장바구니**: 선택한 메뉴를 장바구니에 추가
- **주문 완료**: 장바구니의 메뉴를 주문

### 관리자 화면

- **대시보드**: 주문 통계 확인
- **재고 관리**: 메뉴별 재고 수량 관리
- **주문 관리**: 주문 상태 변경 (접수 → 제조 중 → 완료)

## 🛠 기술 스택

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 (Grid, Flexbox)
- **State Management**: React Hooks (useState, useCallback, useMemo)

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 빌드

```bash
npm run build
```

### 4. 빌드 결과 미리보기

```bash
npm run preview
```

## 🎨 주요 개선사항

### 성능 최적화

- `useCallback`과 `useMemo`를 사용한 함수 및 계산 결과 메모이제이션
- 컴포넌트 외부로 상수 이동
- 불필요한 리렌더링 방지

### 사용자 경험 개선

- 로컬 스토리지를 통한 장바구니 데이터 지속성
- 이미지 로딩 에러 처리
- 중복 클릭 방지
- 사용자 피드백 메시지

### 접근성 개선

- ARIA 라벨 추가
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### 에러 처리

- 데이터 검증 및 타입 안전성
- 예외 상황 처리
- 사용자 친화적인 에러 메시지

## 📱 반응형 디자인

- **PC**: 1200px 고정 너비, 3열 그리드 레이아웃
- **태블릿**: 2열 그리드 레이아웃
- **모바일**: 1열 그리드 레이아웃

## 🔧 개발 환경

- Node.js 18+
- npm 9+
- 모던 브라우저 지원 (Chrome, Firefox, Safari, Edge)

## 📁 프로젝트 구조

```
ui/
├── src/
│   ├── components/
│   │   ├── AdminScreen.jsx      # 관리자 화면
│   │   ├── Header.jsx           # 헤더 컴포넌트
│   │   ├── OrderScreen.jsx      # 주문 화면
│   │   ├── ProductCard.jsx      # 상품 카드
│   │   └── ShoppingCart.jsx     # 장바구니
│   ├── App.jsx                  # 메인 앱 컴포넌트
│   └── main.jsx                 # 앱 진입점
├── public/                      # 정적 파일
└── package.json                 # 프로젝트 설정
```

## 🚀 배포

빌드된 파일은 `dist` 폴더에 생성되며, 정적 웹 서버에서 호스팅할 수 있습니다.

```bash
npm run build
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
