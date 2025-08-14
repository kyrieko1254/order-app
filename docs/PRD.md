# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트명

커피 주문 앱

### 1.2 프로젝트 목적

사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 애플리케이션

### 1.3 개발 범위

- 사용자 주문 화면 (메뉴 선택 및 장바구니 기능)
- 관리자 주문 관리 화면 (재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택

- 프런트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL

## 3. 기본 사항

- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증, 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음
- 관리자는 1명만 있음

## 4. 화면별 상세 명세

### 4.1 주문하기 화면

#### 4.1.1 화면 구성

**헤더 영역**

- 브랜드명 "COZY" 표시 (좌측)
- 네비게이션 버튼: "주문하기", "관리자" (우측)
- 현재 활성화된 화면은 "주문하기"로 표시

**상품 진열 영역**

- 3개의 상품 카드가 가로로 배치
- 각 카드는 동일한 레이아웃 구조를 가짐

**장바구니 영역**

- 화면 하단에 고정된 장바구니 요약 섹션
- 선택된 상품 목록과 총 금액 표시

#### 4.1.2 상품 카드 구성 요소

**상품 정보**

- 상품 이미지 (현재는 플레이스홀더로 X 표시)
- 상품명 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
- 가격 (예: "4,000원", "5,000원")

**옵션 선택**

- 체크박스 형태의 옵션들
- "샷 추가 (+500원)" - 선택 시 가격에 500원 추가
- "시럽 추가 (+0원)" - 선택 시 가격 변화 없음

**액션 버튼**

- "담기" 버튼 - 선택된 옵션과 함께 장바구니에 추가

#### 4.1.3 장바구니 기능

**상품 표시**

- 선택된 상품명과 옵션 표시
- 수량 표시 (예: "X 1", "X 2")
- 개별 상품 가격 표시

**가격 계산**

- 옵션 선택에 따른 가격 변동 반영
- 수량에 따른 가격 계산
- 총 금액 실시간 업데이트

**주문 버튼**

- "주문하기" 버튼으로 최종 주문 진행

#### 4.1.4 상호작용 규칙

**상품 선택**

- 사용자는 상품 카드에서 옵션을 선택할 수 있음
- 옵션은 다중 선택 가능
- "담기" 버튼 클릭 시 선택된 옵션과 함께 장바구니에 추가

**장바구니 관리**

- 동일한 상품+옵션 조합은 수량으로 관리
- 장바구니에 추가된 상품은 실시간으로 총액에 반영
- 장바구니가 비어있을 때는 "주문하기" 버튼 비활성화

**가격 계산 로직**

- 기본 가격 + 선택된 옵션 가격 = 개별 상품 가격
- 개별 상품 가격 × 수량 = 해당 상품 총액
- 모든 상품 총액의 합 = 최종 주문 금액

#### 4.1.5 UI/UX 요구사항

**반응형 디자인**

- 모바일과 데스크톱 환경 모두 지원
- 상품 카드는 화면 크기에 따라 배치 조정

**사용자 경험**

- 직관적인 옵션 선택 인터페이스
- 실시간 가격 업데이트로 투명한 가격 정보 제공
- 명확한 장바구니 상태 표시

**접근성**

- 키보드 네비게이션 지원
- 스크린 리더 호환성 고려
- 충분한 색상 대비 확보

### 4.2 관리자 화면

#### 4.2.1 화면 구성

**헤더 영역**

- 브랜드명 "COZY" 표시 (좌측)
- 네비게이션 버튼: "주문하기", "관리자" (우측)
- 현재 활성화된 화면은 "관리자"로 표시

**관리자 대시보드 영역**

- 주문 통계 요약 정보 표시
- 총 주문 수, 주문 접수 수, 제조 중 수, 제조 완료 수 표시

**재고 현황 영역**

- 각 상품별 현재 재고 수량 표시
- 재고 수량 조정 기능 (+/- 버튼)

**주문 현황 영역**

- 대기 중인 주문 목록 표시
- 각 주문별 상세 정보 및 액션 버튼

#### 4.2.2 관리자 대시보드 기능

**주문 통계 표시**

- "총 주문 1" - 전체 주문 수
- "주문 접수 1" - 접수된 주문 수
- "제조 중 0" - 현재 제조 중인 주문 수
- "제조 완료 0" - 완료된 주문 수

**실시간 업데이트**

- 주문 상태 변경 시 통계 자동 업데이트
- 실시간 데이터 반영

#### 4.2.3 재고 관리 기능

**재고 현황 표시**

- 각 상품별 현재 재고 수량 표시
- 상품명과 재고 수량을 명확히 구분

**재고 조정 기능**

- "+" 버튼: 재고 수량 증가
- "-" 버튼: 재고 수량 감소
- 실시간 재고 수량 업데이트

**재고 관리 규칙**

- 재고는 0개 미만으로 설정 불가
- 재고 부족 시 주문 화면에서 해당 상품 비활성화
- 재고 변경 시 즉시 데이터베이스 반영

#### 4.2.4 주문 관리 기능

**주문 목록 표시**

- 주문 일시 표시 (예: "7월 31일 13:00")
- 주문 상품명과 수량 표시 (예: "아메리카노(ICE) x 1")
- 주문 금액 표시 (예: "4,000원")

**주문 상태 관리**

- "주문 접수" 버튼으로 주문 상태 변경
- 주문 접수 → 제조 중 → 제조 완료 순서로 진행
- 각 단계별 상태 표시

**주문 처리 규칙**

- 새로운 주문은 자동으로 "주문 접수" 상태로 설정
- 관리자가 "주문 접수" 버튼 클릭 시 "제조 중" 상태로 변경
- 제조 완료 시 "제조 완료" 상태로 변경
- 완료된 주문은 목록에서 제거 또는 별도 섹션으로 이동

#### 4.2.5 상호작용 규칙

**재고 조정**

- "+" 버튼 클릭 시 해당 상품 재고 1개 증가
- "-" 버튼 클릭 시 해당 상품 재고 1개 감소
- 재고가 0일 때 "-" 버튼 비활성화

**주문 처리**

- "주문 접수" 버튼 클릭 시 해당 주문의 상태 변경
- 주문 상태 변경 시 대시보드 통계 자동 업데이트
- 주문 처리 완료 시 알림 표시

**데이터 동기화**

- 모든 변경사항은 실시간으로 데이터베이스에 반영
- 프런트엔드와 백엔드 간 실시간 데이터 동기화
- 페이지 새로고침 시에도 데이터 유지

#### 4.2.6 UI/UX 요구사항

**관리자 경험**

- 직관적인 재고 조정 인터페이스
- 명확한 주문 상태 표시
- 실시간 데이터 업데이트로 정확한 정보 제공

**반응형 디자인**

- 모바일과 데스크톱 환경 모두 지원
- 관리자 작업에 최적화된 레이아웃

**접근성**

- 키보드 네비게이션 지원
- 충분한 색상 대비 확보
- 명확한 버튼 라벨링

**성능 요구사항**

- 실시간 데이터 업데이트로 지연 없는 반응
- 동시 다중 사용자 접근 지원
- 안정적인 데이터 처리 및 저장

## 5. 백엔드 개발 명세

### 5.1 데이터 모델 설계

#### 5.1.1 Menus 테이블

**테이블 구조**

```sql
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url VARCHAR(255),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**필드 설명**

- `id`: 메뉴 고유 식별자 (자동 증가)
- `name`: 커피 이름 (예: "아메리카노(ICE)", "카페라떼")
- `description`: 메뉴 설명
- `price`: 메뉴 가격 (원 단위)
- `image_url`: 메뉴 이미지 URL
- `stock_quantity`: 재고 수량
- `created_at`: 생성 일시
- `updated_at`: 수정 일시

#### 5.1.2 Options 테이블

**테이블 구조**

```sql
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER DEFAULT 0,
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**필드 설명**

- `id`: 옵션 고유 식별자 (자동 증가)
- `name`: 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price`: 옵션 가격 (원 단위, 기본값 0)
- `menu_id`: 연결된 메뉴 ID (외래키)
- `created_at`: 생성 일시

#### 5.1.3 Orders 테이블

**테이블 구조**

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**필드 설명**

- `id`: 주문 고유 식별자 (자동 증가)
- `order_datetime`: 주문 일시
- `total_amount`: 주문 총 금액
- `status`: 주문 상태 ('pending', 'preparing', 'completed')
- `created_at`: 생성 일시
- `updated_at`: 수정 일시

#### 5.1.4 OrderItems 테이블

**테이블 구조**

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id),
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    selected_options TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**필드 설명**

- `id`: 주문 아이템 고유 식별자 (자동 증가)
- `order_id`: 주문 ID (외래키)
- `menu_id`: 메뉴 ID (외래키)
- `quantity`: 주문 수량
- `unit_price`: 단가 (옵션 포함)
- `total_price`: 해당 아이템 총 가격 (unit_price × quantity)
- `selected_options`: 선택된 옵션 정보 (JSON 형태)
- `created_at`: 생성 일시

### 5.2 사용자 흐름 및 데이터 처리

#### 5.2.1 메뉴 조회 흐름

**프로세스**

1. 사용자가 주문 화면 접속
2. 백엔드에서 Menus 테이블의 모든 메뉴 정보 조회
3. 각 메뉴에 연결된 Options 정보도 함께 조회
4. 재고 수량이 0인 메뉴는 비활성화 상태로 표시
5. 관리자 화면에서는 재고 수량을 별도로 표시

**API 엔드포인트**

- `GET /api/menus`: 모든 메뉴 정보 조회 (옵션 포함)
- `GET /api/menus/stock`: 재고 현황 조회 (관리자용)
- `GET /api/menus/:id`: 특정 메뉴 상세 정보 조회

#### 5.2.2 장바구니 처리 흐름

**프로세스**

1. 사용자가 메뉴 선택 및 옵션 선택
2. 선택 정보를 프론트엔드에서 임시 저장
3. 장바구니에 상품 추가 시 수량 관리
4. 실시간 가격 계산 (메뉴 가격 + 옵션 가격) × 수량

**데이터 구조**

```javascript
// 장바구니 아이템 구조
{
    menuId: 1,
    menuName: "아메리카노(ICE)",
    quantity: 2,
    unitPrice: 4000,
    selectedOptions: [
        { name: "샷 추가", price: 500 },
        { name: "시럽 추가", price: 0 }
    ],
    totalPrice: 9000 // (4000 + 500 + 0) × 2
}
```

#### 5.2.3 주문 처리 흐름

**프로세스**

1. 사용자가 "주문하기" 버튼 클릭
2. 장바구니 정보를 Orders 테이블에 저장
3. 각 주문 아이템을 OrderItems 테이블에 저장
4. 주문된 메뉴의 재고 수량 감소
5. 주문 완료 후 장바구니 초기화

**API 엔드포인트**

- `POST /api/orders`: 새 주문 생성
- `GET /api/orders`: 모든 주문 목록 조회 (상태별 필터링 가능)
- `GET /api/orders/:id`: 특정 주문 정보 조회

#### 5.2.4 관리자 주문 관리 흐름

**프로세스**

1. 관리자 화면에서 Orders 테이블의 주문 목록 조회
2. 주문 상태별 필터링 및 통계 계산
3. 주문 상태 변경 시 Orders 테이블 업데이트
4. 실시간 주문 현황 업데이트

**API 엔드포인트**

- `GET /api/orders`: 모든 주문 목록 조회 (상태별 필터링 가능)
- `PUT /api/orders/:id/status`: 주문 상태 변경
- `GET /api/orders/statistics`: 주문 통계 조회

### 5.3 API 설계

#### 5.3.1 메뉴 관련 API

**메뉴 목록 조회**

```
GET /api/menus
Response: {
    "success": true,
    "data": {
        "menus": [
            {
                "id": 1,
                "name": "아메리카노(ICE)",
                "description": "깔끔한 아메리카노",
                "price": 4000,
                "image_url": "/images/americano.jpg",
                "stock_quantity": 10,
                "options": [
                    {
                        "id": 1,
                        "name": "샷 추가",
                        "price": 500
                    }
                ]
            }
        ]
    }
}
```

**메뉴 상세 조회**

```
GET /api/menus/:id
Response: {
    "success": true,
    "data": {
        "id": 1,
        "name": "아메리카노(ICE)",
        "description": "깔끔한 아메리카노",
        "price": 4000,
        "image_url": "/images/americano.jpg",
        "stock_quantity": 10,
        "options": [...]
    }
}
```

#### 5.3.2 주문 관련 API

**주문 생성**

```
POST /api/orders
Request: {
    "items": [
        {
            "menu_id": 1,
            "quantity": 2,
            "selected_options": ["샷 추가", "시럽 추가"]
        }
    ]
}
Response: {
    "success": true,
    "data": {
        "order_id": 1,
        "total_amount": 9000
    },
    "message": "주문이 성공적으로 처리되었습니다."
}
```

**주문 목록 조회**

```
GET /api/orders
GET /api/orders?status=pending
Response: {
    "success": true,
    "data": {
        "orders": [
            {
                "id": 1,
                "order_datetime": "2024-01-15T10:30:00Z",
                "total_amount": 9000,
                "status": "pending",
                "items": [
                    {
                        "menu_name": "아메리카노(ICE)",
                        "quantity": 2,
                        "unit_price": 4500,
                        "total_price": 9000,
                        "selected_options": ["샷 추가", "시럽 추가"]
                    }
                ]
            }
        ]
    }
}
```

**주문 상태 변경**

```
PUT /api/orders/:id/status
Request: {
    "status": "preparing"
}
Response: {
    "success": true,
    "data": {
        "id": 1,
        "status": "preparing",
        "updated_at": "2024-01-15T10:35:00Z"
    },
    "message": "주문 상태가 성공적으로 변경되었습니다."
}
```

**주문 통계 조회**

```
GET /api/orders/statistics
Response: {
    "success": true,
    "data": {
        "total_orders": 5,
        "pending_orders": 2,
        "processing_orders": 1,
        "completed_orders": 2
    }
}
```

#### 5.3.3 재고 관리 API

**재고 수량 조정**

```
PUT /api/menus/:id/stock
Request: {
    "stock_quantity": 15
}
Response: {
    "success": true,
    "data": {
        "id": 1,
        "stock_quantity": 15,
        "updated_at": "2024-01-15T10:40:00Z"
    },
    "message": "재고 수량이 성공적으로 업데이트되었습니다."
}
```

### 5.4 데이터베이스 연동 및 비즈니스 로직

#### 5.4.1 재고 관리 로직

**재고 감소 규칙**

- 주문 생성 시 해당 메뉴의 재고 수량 자동 감소
- 재고가 0인 메뉴는 주문 불가
- 재고 부족 시 주문 거부 및 에러 메시지 반환

**재고 증가 규칙**

- 관리자가 재고 수량 조정 시 즉시 반영
- 재고 수량은 0 이상으로 제한

#### 5.4.2 주문 상태 관리 로직

**상태 변경 규칙**

- 새 주문: "pending" 상태로 자동 설정
- pending → preparing → completed 순서로 진행
- 완료된 주문은 별도 관리 또는 아카이브 처리

#### 5.4.3 가격 계산 로직

**가격 계산 공식**

```
메뉴 기본 가격 + 선택된 옵션 가격 = 단가
단가 × 수량 = 해당 상품 총액
모든 상품 총액의 합 = 주문 총액
```

**옵션 가격 처리**

- 옵션 가격이 0인 경우에도 옵션 정보는 저장
- 옵션 선택에 따른 실시간 가격 업데이트

### 5.5 에러 처리 및 예외 상황

#### 5.5.1 일반적인 에러 응답 형식

```javascript
{
    "success": false,
    "error": {
        "code": "INVALID_REQUEST",
        "message": "잘못된 요청입니다.",
        "details": "필수 필드가 누락되었습니다."
    }
}
```

#### 5.5.2 주요 에러 상황

- **재고 부족**: 주문 시 재고가 부족한 경우
- **잘못된 주문 상태**: 허용되지 않은 상태 변경 시도 (pending, preparing, completed만 허용)
- **존재하지 않는 메뉴**: 존재하지 않는 메뉴 ID로 주문 시도
- **잘못된 수량**: 주문 수량이 1개 미만인 경우
- **데이터베이스 연결 오류**: DB 연결 실패 시

### 5.6 성능 및 보안 고려사항

#### 5.6.1 성능 최적화

- 데이터베이스 인덱스 설정 (주문 시간, 메뉴 ID 등)
- API 응답 캐싱 (메뉴 정보 등 변경이 적은 데이터)
- 페이지네이션 적용 (주문 목록 조회 시)

#### 5.6.2 보안 고려사항

- SQL 인젝션 방지를 위한 파라미터 바인딩
- 입력 데이터 검증 및 sanitization
- CORS 설정으로 허용된 도메인만 접근 가능

### 5.7 개발 환경 설정

#### 5.7.1 데이터베이스 초기화

```sql
-- 초기 메뉴 데이터 삽입
INSERT INTO menus (name, description, price, stock_quantity) VALUES
('아메리카노(ICE)', '깔끔한 아메리카노', 4000, 10),
('아메리카노(HOT)', '따뜻한 아메리카노', 4000, 10),
('카페라떼', '부드러운 카페라떼', 5000, 10);

-- 초기 옵션 데이터 삽입
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 1),
('시럽 추가', 0, 1),
('샷 추가', 500, 2),
('시럽 추가', 0, 2),
('샷 추가', 500, 3),
('시럽 추가', 0, 3);

-- 주문 상태는 다음 중 하나로 설정:
-- 'pending': 주문 접수
-- 'preparing': 제조 중
-- 'completed': 완료
```

#### 5.7.2 환경 변수 설정

```env
# .env 파일
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development
```
