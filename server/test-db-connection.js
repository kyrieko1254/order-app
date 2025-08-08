const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "coffee_order_db",
  user: "postgres",
  password: "qhadufma!1",
});

async function testConnection() {
  try {
    console.log("데이터베이스 연결을 시도합니다...");

    const client = await pool.connect();
    console.log("✅ PostgreSQL 데이터베이스에 성공적으로 연결되었습니다!");

    // 간단한 쿼리 테스트
    const result = await client.query("SELECT NOW() as current_time");
    console.log("현재 시간:", result.rows[0].current_time);

    // 메뉴 테이블 확인
    const menusResult = await client.query(
      "SELECT COUNT(*) as count FROM menus"
    );
    console.log("메뉴 개수:", menusResult.rows[0].count);

    // 메뉴 데이터 확인
    const menusData = await client.query(
      "SELECT id, name, price FROM menus LIMIT 3"
    );
    console.log("메뉴 데이터:");
    menusData.rows.forEach((menu) => {
      console.log(`  - ${menu.name}: ${menu.price}원`);
    });

    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("💡 PostgreSQL 서비스가 실행되지 않았을 수 있습니다.");
    } else if (error.code === "3D000") {
      console.log("💡 데이터베이스가 존재하지 않습니다.");
    } else if (error.code === "28P01") {
      console.log("💡 사용자 인증에 실패했습니다.");
    }
  }
}

testConnection();

