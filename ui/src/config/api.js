// API 설정
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// 환경 확인
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

// 디버깅 정보
console.log("=== API 설정 정보 ===");
console.log("API_BASE_URL:", API_BASE_URL);
console.log("isProduction:", isProduction);
console.log("isDevelopment:", isDevelopment);
console.log("=====================");

// API 엔드포인트
export const API_ENDPOINTS = {
  MENUS: "/menus",
  ORDERS: "/orders",
  STOCK: "/menus/stock",
  INVENTORY: "/menus",
};

// API URL 생성 함수
export const getApiUrl = (endpoint) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log("생성된 API URL:", fullUrl);
  return fullUrl;
};
