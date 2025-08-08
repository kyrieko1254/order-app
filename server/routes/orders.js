const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// 모든 주문 조회 (관리자용)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT 
        o.id,
        o.order_datetime,
        o.total_amount::numeric as total_amount,
        o.status,
        json_agg(
          json_build_object(
            'menu_name', m.name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'selected_options', oi.selected_options
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
    `;

    if (status) {
      query += ` WHERE o.status = $1`;
      query += ` GROUP BY o.id, o.order_datetime, o.total_amount, o.status`;
      query += ` ORDER BY o.order_datetime DESC`;

      const result = await pool.query(query, [status]);
      return res.json({
        success: true,
        data: {
          orders: result.rows,
        },
      });
    }

    query += ` GROUP BY o.id, o.order_datetime, o.total_amount, o.status`;
    query += ` ORDER BY o.order_datetime DESC`;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: {
        orders: result.rows,
      },
    });
  } catch (error) {
    console.error("주문 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 조회 중 오류가 발생했습니다.",
    });
  }
});

// 특정 주문 조회
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        o.id,
        o.order_datetime,
        o.total_amount::numeric as total_amount,
        o.status,
        json_agg(
          json_build_object(
            'menu_name', m.name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'selected_options', oi.selected_options
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE o.id = $1
      GROUP BY o.id, o.order_datetime, o.total_amount, o.status
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "해당 주문을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("주문 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 조회 중 오류가 발생했습니다.",
    });
  }
});

// 새로운 주문 생성
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "주문 항목이 필요합니다.",
      });
    }

    await client.query("BEGIN");

    // 재고 확인 및 총액 계산
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { menu_id, quantity, selected_options } = item;

      if (quantity <= 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "주문 수량은 1개 이상이어야 합니다.",
        });
      }

      // 메뉴 정보 조회
      const menuQuery = `
        SELECT m.name, m.price, m.stock_quantity,
               json_agg(json_build_object('name', o.name, 'price', o.price)) as options
        FROM menus m
        LEFT JOIN options o ON m.id = o.menu_id
        WHERE m.id = $1
        GROUP BY m.id, m.name, m.price, m.stock_quantity
      `;

      const menuResult = await client.query(menuQuery, [menu_id]);

      if (menuResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 메뉴입니다.",
        });
      }

      const menu = menuResult.rows[0];

      // 재고 확인
      if (menu.stock_quantity < quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "INSUFFICIENT_STOCK",
          message: "재고가 부족합니다.",
          details: {
            menu_id,
            requested_quantity: quantity,
            available_quantity: menu.stock_quantity,
          },
        });
      }

      // 옵션 가격 계산
      let optionPrice = 0;
      if (selected_options && selected_options.length > 0) {
        const optionQuery = `
          SELECT SUM(price) as total_option_price
          FROM options
          WHERE menu_id = $1 AND name = ANY($2)
        `;
        const optionResult = await client.query(optionQuery, [
          menu_id,
          selected_options,
        ]);
        optionPrice = Number(optionResult.rows[0].total_option_price) || 0;
      }

      // 명시적으로 숫자로 변환
      const menuPrice = Number(menu.price);
      const optionPriceNum = Number(optionPrice);
      const unitPrice = menuPrice + optionPriceNum;
      const itemTotalPrice = unitPrice * quantity;
      totalAmount += itemTotalPrice;

      orderItems.push({
        menu_id,
        quantity,
        unit_price: unitPrice,
        total_price: itemTotalPrice,
        selected_options: selected_options || [],
      });
    }

    // 주문 생성
    const orderQuery = `
      INSERT INTO orders (total_amount)
      VALUES ($1)
      RETURNING id
    `;

    const orderResult = await client.query(orderQuery, [Number(totalAmount)]);
    const orderId = orderResult.rows[0].id;

    // 주문 상세 항목 생성
    for (const item of orderItems) {
      const itemQuery = `
        INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price, selected_options)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      await client.query(itemQuery, [
        orderId,
        item.menu_id,
        item.quantity,
        item.unit_price,
        item.total_price,
        JSON.stringify(item.selected_options),
      ]);

      // 재고 차감
      const stockQuery = `
        UPDATE menus
        SET stock_quantity = stock_quantity - $1
        WHERE id = $2
      `;

      await client.query(stockQuery, [item.quantity, item.menu_id]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      data: {
        order_id: orderId,
        total_amount: totalAmount,
      },
      message: "주문이 성공적으로 처리되었습니다.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("주문 생성 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 처리 중 오류가 발생했습니다.",
    });
  } finally {
    client.release();
  }
});

// 주문 상태 변경
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 주문 상태입니다.",
      });
    }

    const query = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "해당 주문을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "주문 상태가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    console.error("주문 상태 변경 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 상태 변경 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
