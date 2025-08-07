import React, { useState } from "react";
import "./AdminScreen.css";

const AdminScreen = () => {
  // 주문 상태 관리
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: "7월 31일 13:00",
      items: [{ name: "아메리카노(ICE)", quantity: 1, price: 4000 }],
      total: 4000,
      status: "received" // received, processing, completed
    }
  ]);

  // 재고 상태 관리
  const [inventory, setInventory] = useState([
    { id: 1, name: "아메리카노 (ICE)", quantity: 10 },
    { id: 2, name: "아메리카노 (HOT)", quantity: 10 },
    { id: 3, name: "카페라떼", quantity: 10 }
  ]);

  // 주문 통계 계산
  const orderStats = {
    total: orders.length,
    received: orders.filter(order => order.status === "received").length,
    processing: orders.filter(order => order.status === "processing").length,
    completed: orders.filter(order => order.status === "completed").length
  };

  // 재고 상태 업데이트 함수
  const getInventoryStatus = (quantity) => {
    if (quantity === 0) return "품절";
    if (quantity < 5) return "주의";
    return "정상";
  };

  // 재고 수량 변경 함수
  const updateInventoryQuantity = (id, change) => {
    setInventory(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return {
            ...item,
            quantity: newQuantity
          };
        }
        return item;
      })
    );
  };

  // 주문 상태 변경 함수
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  // 주문 상태에 따른 버튼 텍스트
  const getStatusButtonText = (status) => {
    switch (status) {
      case "received":
        return "제조 시작";
      case "processing":
        return "제조 완료";
      case "completed":
        return "완료";
      default:
        return "주문 접수";
    }
  };

  // 주문 상태에 따른 다음 상태
  const getNextStatus = (status) => {
    switch (status) {
      case "received":
        return "processing";
      case "processing":
        return "completed";
      default:
        return status;
    }
  };

  return (
    <div className="admin-screen">
      <div className="container">
        {/* 관리자 대시보드 */}
        <div className="admin-dashboard">
          <h2>관리자 대시보드</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">총 주문</span>
              <span className="stat-value">{orderStats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">주문 접수</span>
              <span className="stat-value">{orderStats.received}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">제조 중</span>
              <span className="stat-value">{orderStats.processing}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">제조 완료</span>
              <span className="stat-value">{orderStats.completed}</span>
            </div>
          </div>
        </div>

        {/* 재고 현황 */}
        <div className="inventory-status">
          <h2>재고 현황</h2>
          <div className="inventory-grid">
            {inventory.map(item => {
              const status = getInventoryStatus(item.quantity);
              const statusClass = status === "정상" ? "normal" : status === "주의" ? "warning" : "out";
              
              return (
                <div key={item.id} className="inventory-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">{item.quantity}개</span>
                    <span className={`item-status status-${statusClass}`}>
                      {status}
                    </span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn minus"
                      onClick={() => updateInventoryQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <button
                      className="quantity-btn plus"
                      onClick={() => updateInventoryQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 주문 현황 */}
        <div className="order-status">
          <h2>주문 현황</h2>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p className="no-orders">주문이 없습니다.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <div className="order-header">
                      <span className="order-date">{order.date}</span>
                      <span className="order-total">{order.total.toLocaleString()}원</span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <span key={index} className="order-item-name">
                          {item.name} x {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="order-actions">
                    <button
                      className={`status-btn status-${order.status}`}
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                      disabled={order.status === "completed"}
                    >
                      {getStatusButtonText(order.status)}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
