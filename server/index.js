const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://coffee-order-frontend.onrender.com",
    "https://your-frontend-app-name.onrender.com", // 실제 프론트엔드 도메인으로 변경
    /\.onrender\.com$/, // Render.com 도메인 모두 허용
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "커피 주문 앱 백엔드 서버가 실행 중입니다." });
});

// API 라우트
app.use("/api/menus", require("./routes/menus"));
app.use("/api/orders", require("./routes/orders"));

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error("=== 서버 오류 발생 ===");
  console.error("요청 URL:", req.url);
  console.error("요청 메서드:", req.method);
  console.error("요청 헤더:", req.headers);
  console.error("오류 스택:", err.stack);
  console.error("=====================");

  res.status(500).json({
    success: false,
    message: "서버 내부 오류가 발생했습니다.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "요청한 리소스를 찾을 수 없습니다.",
  });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
