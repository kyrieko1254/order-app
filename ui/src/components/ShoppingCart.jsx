import React, { useMemo } from "react";
import "./ShoppingCart.css";

const ShoppingCart = ({ cart, onUpdateQuantity, onOrder, total }) => {
  const calculateItemPrice = (item) => {
    if (!item || !item.product || !item.options) {
      console.warn('Invalid cart item:', item);
      return 0;
    }

    const optionsPrice = item.options.reduce((sum, option) => {
      if (option === "샷 추가") return sum + 500;
      if (option === "시럽 추가") return sum + 0;
      return sum;
    }, 0);
    
    return (item.product.price + optionsPrice) * item.quantity;
  };

  const formatItemName = (item) => {
    if (!item || !item.product) {
      return '알 수 없는 상품';
    }

    let name = item.product.name;
    if (item.options && item.options.length > 0) {
      name += ` (${item.options.join(", ")})`;
    }
    return name;
  };

  // 같은 메뉴+옵션 조합을 합쳐서 표시
  const groupedCart = useMemo(() => {
    if (!Array.isArray(cart)) {
      console.warn('Cart is not an array:', cart);
      return {};
    }

    return cart.reduce((acc, item) => {
      if (!item || !item.product) {
        console.warn('Invalid cart item:', item);
        return acc;
      }

      const key = `${item.product.id}-${(item.options || []).sort().join('-')}`;
      if (acc[key]) {
        acc[key].quantity += item.quantity;
      } else {
        acc[key] = { ...item };
      }
      return acc;
    }, {});
  }, [cart]);

  const cartItems = Object.values(groupedCart);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (typeof newQuantity !== 'number' || newQuantity < 0) {
      console.warn('Invalid quantity:', newQuantity);
      return;
    }
    onUpdateQuantity(itemId, newQuantity);
  };

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    
    if (total <= 0) {
      alert('주문 금액이 올바르지 않습니다.');
      return;
    }

    onOrder();
  };

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h3>장바구니</h3>
      </div>
      
      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p className="empty-cart">장바구니가 비어있습니다.</p>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">{formatItemName(item)}</span>
                    <div className="item-details">
                      <span className="item-price">{calculateItemPrice(item).toLocaleString()}원</span>
                      <span className="item-quantity-display">수량: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      aria-label="수량 감소"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="cart-summary-section">
          {cartItems.length > 0 && (
            <>
              <div className="total">
                <span>총 금액</span>
                <span className="total-price">{total.toLocaleString()}원</span>
              </div>
              
              <button 
                className="order-btn"
                onClick={handleOrder}
                disabled={cartItems.length === 0 || total <= 0}
              >
                주문하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
