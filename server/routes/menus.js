const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// 모든 메뉴 조회
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image_url,
        m.stock_quantity,
        json_agg(
          json_build_object(
            'id', o.id,
            'name', o.name,
            'price', o.price
          )
        ) as options
      FROM menus m
      LEFT JOIN options o ON m.id = o.menu_id
      GROUP BY m.id, m.name, m.description, m.price, m.image_url, m.stock_quantity
      ORDER BY m.id
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: {
        menus: result.rows,
      },
    });
  } catch (error) {
    console.error("메뉴 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "메뉴 조회 중 오류가 발생했습니다.",
    });
  }
});

// 재고 현황 조회 (관리자용)
router.get("/stock", async (req, res) => {
  try {
    const query = `
      SELECT id, name, stock_quantity
      FROM menus
      ORDER BY id
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: {
        stock: result.rows,
      },
    });
  } catch (error) {
    console.error("재고 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "재고 조회 중 오류가 발생했습니다.",
    });
  }
});

// 특정 메뉴 재고 수량 변경
router.put("/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "재고 수량은 0 이상이어야 합니다.",
      });
    }

    const query = `
      UPDATE menus 
      SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [stock_quantity, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "해당 메뉴를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "재고 수량이 성공적으로 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("재고 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      message: "재고 업데이트 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
