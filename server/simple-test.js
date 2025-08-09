const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

const testConnection = async () => {
  try {
    console.log('연결 시도 중...');
    const client = await pool.connect();
    console.log('✅ 연결 성공!');
    
    const result = await client.query('SELECT NOW()');
    console.log('현재 시간:', result.rows[0].now);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ 연결 실패:', error.message);
  }
};

testConnection();

