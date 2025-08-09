import React, { useState, useCallback, useMemo, useEffect } from "react";
import "./AdminScreen.css";
import { getApiUrl, API_ENDPOINTS } from "../config/api";

const AdminScreen = () => {
  // 주문 상태 관리
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 주문 데이터 가져오기
        const ordersResponse = await fetch(`${getApiUrl(API_ENDPOINTS.ORDERS)}`);
        const ordersData = await ordersResponse.json();
        
        // 재고 데이터 가져오기
        const inventoryResponse = await fetch(`${getApiUrl(API_ENDPOINTS.STOCK)}`);
        const inventoryData = await inventoryResponse.json();
        
        if (ordersData.success && inventoryData.success) {
          setOrders(ordersData.data.orders || []);
          setInventory(inventoryData.data.stock || []);
        } else {
          setError('데이터를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('데이터 로드 오류:', error);
        setError('서버 연결에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // 30초마다 데이터 새로고침
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 주문 통계 계산 - useMemo로 최적화
  const orderStats = useMemo(() => ({
    total: orders.length,
    received: orders.filter(order => order.status === "pending").length,
    processing: orders.filter(order => order.status === "preparing").length,
    completed: orders.filter(order => order.status === "completed").length
  }), [orders]);

  // 재고 상태 업데이트 함수
  const getInventoryStatus = useCallback((quantity) => {
    if (quantity === 0) return "품절";
    if (quantity < 5) return "주의";
    return "정상";
  }, []);

  // 재고 수량 변경 함수
  const updateInventoryQuantity = useCallback(async (id, change) => {
    try {
      const item = inventory.find(item => item.id === id);
      if (!item) return;

      const newQuantity = Math.max(0, item.stock_quantity + change);
      
      const response = await fetch(`${getApiUrl(API_ENDPOINTS.MENUS)}/${id}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock_quantity: newQuantity })
      });

      const data = await response.json();
      
      if (data.success) {
        setInventory(prev => 
          prev.map(item => 
            item.id === id 
              ? { ...item, stock_quantity: newQuantity }
              : item
          )
        );
        
        // 재고 부족 경고
        if (newQuantity <= 5 && newQuantity > 0) {
          alert(`${item.name}의 재고가 부족합니다. (${newQuantity}개 남음)`);
        }
      } else {
        alert(`재고 업데이트 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('재고 업데이트 오류:', error);
      alert('재고 업데이트 중 오류가 발생했습니다.');
    }
  }, [inventory]);

  // 주문 상태 변경 함수
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const response = await fetch(`${getApiUrl(API_ENDPOINTS.ORDERS)}/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        // 상태 변경 피드백
        const statusMessages = {
          preparing: "제조를 시작합니다.",
          completed: "제조가 완료되었습니다."
        };
        
        if (statusMessages[newStatus]) {
          alert(statusMessages[newStatus]);
        }
      } else {
        alert(`주문 상태 변경 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('주문 상태 변경 오류:', error);
      alert('주문 상태 변경 중 오류가 발생했습니다.');
    }
  }, []);

  // 주문 상태에 따른 버튼 텍스트
  const getStatusButtonText = useCallback((status) => {
    switch (status) {
      case "pending":
        return "제조 시작";
      case "preparing":
        return "제조 완료";
      case "completed":
        return "완료";
      default:
        return "주문 접수";
    }
  }, []);

  // 주문 상태에 따른 다음 상태
  const getNextStatus = useCallback((status) => {
    switch (status) {
      case "pending":
        return "preparing";
      case "preparing":
        return "completed";
      default:
        return status;
    }
  }, []);

  // 주문 상태 변경 핸들러
  const handleStatusChange = useCallback((orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    updateOrderStatus(orderId, nextStatus);
  }, [getNextStatus, updateOrderStatus]);

  // 재고 수량 변경 핸들러
  const handleInventoryChange = useCallback((id, change) => {
    const item = inventory.find(item => item.id === id);
    if (!item) return;

    const newQuantity = item.stock_quantity + change;
    
    if (newQuantity < 0) {
      alert("재고 수량은 0보다 작을 수 없습니다.");
      return;
    }

    updateInventoryQuantity(id, change);
  }, [inventory, updateInventoryQuantity]);

  if (loading) {
    return (
      <div className="admin-screen">
        <div className="container">
          <div className="loading">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-screen">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

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
              const status = getInventoryStatus(item.stock_quantity);
              const statusClass = status === "정상" ? "normal" : status === "주의" ? "warning" : "out";
              
              return (
                <div key={item.id} className="inventory-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">{item.stock_quantity}개</span>
                    <span className={`item-status status-${statusClass}`}>
                      {status}
                    </span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn minus"
                      onClick={() => handleInventoryChange(item.id, -1)}
                      disabled={item.stock_quantity <= 0}
                      aria-label={`${item.name} 재고 감소`}
                    >
                      -
                    </button>
                    <button
                      className="quantity-btn plus"
                      onClick={() => handleInventoryChange(item.id, 1)}
                      aria-label={`${item.name} 재고 증가`}
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
                      <span className="order-date">
                        {new Date(order.order_datetime).toLocaleString('ko-KR')}
                      </span>
                      <span className="order-total">{Number(order.total_amount).toLocaleString()}원</span>
                    </div>
                    <div className="order-items">
                      {order.items && order.items.map((item, index) => (
                        <span key={index} className="order-item-name">
                          {item.menu_name} x {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="order-actions">
                    <button
                      className={`status-btn status-${order.status}`}
                      onClick={() => handleStatusChange(order.id, order.status)}
                      disabled={order.status === "completed"}
                      aria-label={`주문 상태 변경: ${getStatusButtonText(order.status)}`}
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
