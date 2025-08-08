const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// 데이터베이스 연결 테스트
pool.on("connect", () => {
  console.log("PostgreSQL 데이터베이스에 연결되었습니다.");
});

pool.on("error", (err) => {
  console.error("PostgreSQL 데이터베이스 연결 오류:", err);
});

module.exports = pool;
