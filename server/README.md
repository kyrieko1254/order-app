# 커피 주문 앱 백엔드 서버

## 프로젝트 개요

커피 주문 앱의 백엔드 API 서버입니다. Express.js와 PostgreSQL을 사용하여 구축되었습니다.

## 기술 스택

- **Node.js**: JavaScript 런타임
- **Express.js**: 웹 프레임워크
- **PostgreSQL**: 데이터베이스
- **pg**: PostgreSQL 클라이언트
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: 환경 변수 관리

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

### 3. 데이터베이스 설정

PostgreSQL 데이터베이스를 생성하고 `docs/PRD.md`의 5.4 섹션에 있는 SQL 스키마를 실행하세요.

### 4. 서버 실행

개발 모드:

```bash
npm run dev
```

프로덕션 모드:

```bash
npm start
```

## API 엔드포인트

### 메뉴 관련 API

- `GET /api/menus` - 모든 메뉴 조회
- `GET /api/menus/stock` - 재고 현황 조회 (관리자용)
- `PUT /api/menus/:id/stock` - 재고 수량 변경

### 주문 관련 API

- `GET /api/orders` - 모든 주문 조회 (관리자용)
- `GET /api/orders/:id` - 특정 주문 조회
- `POST /api/orders` - 새로운 주문 생성
- `PUT /api/orders/:id/status` - 주문 상태 변경

## 프로젝트 구조

```
server/
├── config/
│   └── database.js      # 데이터베이스 연결 설정
├── routes/
│   ├── menus.js         # 메뉴 관련 API 라우트
│   └── orders.js        # 주문 관련 API 라우트
├── index.js             # 서버 메인 파일
├── package.json         # 프로젝트 설정
├── .env                 # 환경 변수
└── README.md           # 프로젝트 문서
```

## 개발 가이드

### 새로운 라우트 추가

1. `routes/` 폴더에 새로운 라우트 파일 생성
2. `index.js`에서 라우트 연결
3. API 문서 업데이트

### 데이터베이스 마이그레이션

스키마 변경 시 `docs/PRD.md`의 SQL 스키마를 업데이트하고 데이터베이스에 적용하세요.

## 라이센스

ISC
