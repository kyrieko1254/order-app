# 프론트엔드 배포 가이드

## Render.com 배포 과정

### 1. 사전 준비사항

1. **GitHub 저장소 준비**

   - 코드가 GitHub 저장소에 푸시되어 있어야 합니다.
   - `ui` 폴더가 루트에 있어야 합니다.

2. **환경 변수 설정**
   - `VITE_API_BASE_URL`: 백엔드 API URL (예: `https://your-backend-app.onrender.com/api`)

### 2. Render.com 배포 단계

#### 2.1 Static Site 생성

1. Render.com 대시보드에서 **"New +"** 클릭
2. **"Static Site"** 선택
3. GitHub 저장소 연결

#### 2.2 배포 설정

- **Name**: `coffee-order-frontend` (또는 원하는 이름)
- **Build Command**: `cd ui && npm install && npm run build`
- **Publish Directory**: `ui/dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://your-backend-app-name.onrender.com/api`

#### 2.3 고급 설정

- **Auto-Deploy**: `Yes` (GitHub 푸시 시 자동 배포)
- **Branch**: `main` (또는 사용하는 브랜치)

### 3. 배포 후 확인사항

1. **빌드 로그 확인**

   - Build Command가 성공적으로 실행되었는지 확인
   - 에러가 있다면 로그를 확인하여 수정

2. **환경 변수 확인**

   - 브라우저 개발자 도구에서 `import.meta.env.VITE_API_BASE_URL` 값 확인

3. **API 연결 테스트**
   - 주문 화면에서 메뉴가 정상적으로 로드되는지 확인
   - 관리자 화면에서 주문 현황이 표시되는지 확인

### 4. 문제 해결

#### 4.1 빌드 실패

- `package.json`의 의존성이 올바른지 확인
- Node.js 버전이 호환되는지 확인 (v18 이상 권장)

#### 4.2 API 연결 실패

- 환경 변수 `VITE_API_BASE_URL`이 올바른지 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정이 올바른지 확인

#### 4.3 이미지 로드 실패

- 이미지 경로가 올바른지 확인
- `public` 폴더의 이미지가 `dist` 폴더에 복사되었는지 확인

### 5. 성능 최적화

1. **이미지 최적화**

   - WebP 형식 사용 권장
   - 적절한 크기로 리사이징

2. **코드 분할**

   - Vite의 자동 코드 분할 활용
   - 큰 의존성은 별도 청크로 분리

3. **캐싱 전략**
   - 정적 자산에 적절한 캐시 헤더 설정
   - Service Worker 활용 고려
