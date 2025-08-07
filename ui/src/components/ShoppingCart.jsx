import React from "react";
import "./ShoppingCart.css";

const ShoppingCart = ({ cart, onUpdateQuantity, onOrder, total }) => {
  const calculateItemPrice = (item) => {
    const optionsPrice = item.options.reduce((sum, option) => {
      if (option === "샷 추가") return sum + 500;
      if (option === "시럽 추가") return sum + 0;
      return sum;
    }, 0);
    return (item.product.price + optionsPrice) * item.quantity;
  };

  const formatItemName = (item) => {
    let name = item.product.name;
    if (item.options.length > 0) {
      name += ` (${item.options.join(", ")})`;
    }
    return name;
  };

  // 같은 메뉴+옵션 조합을 합쳐서 표시
  const groupedCart = cart.reduce((acc, item) => {
    const key = `${item.product.id}-${item.options.sort().join('-')}`;
    if (acc[key]) {
      acc[key].quantity += item.quantity;
    } else {
      acc[key] = { ...item };
    }
    return acc;
  }, {});

  const cartItems = Object.values(groupedCart);

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
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
                onClick={onOrder}
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
