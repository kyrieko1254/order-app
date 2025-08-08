const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
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
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "서버 내부 오류가 발생했습니다.",
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
