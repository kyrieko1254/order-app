import React, { useState, useCallback, useMemo, useEffect } from "react";
import "./OrderScreen.css";
import ProductCard from "./ProductCard";
import ShoppingCart from "./ShoppingCart";

// 상수를 컴포넌트 외부로 이동
const PRODUCTS = [
  {
    id: 1,
    name: "아메리카노(ICE)",
    price: 4000,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop",
    description: "시원한 아이스 아메리카노"
  },
  {
    id: 2,
    name: "아메리카노(HOT)",
    price: 4000,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop",
    description: "따뜻한 핫 아메리카노"
  },
  {
    id: 3,
    name: "카페라떼",
    price: 5000,
    image: "https://images.unsplash.com/photo-1561043433-9265f73e685f?w=300&h=200&fit=crop",
    description: "부드러운 카페라떼"
  }
];

const CART_STORAGE_KEY = 'cozy-cart';

const OrderScreen = () => {
  // 로컬 스토리지에서 장바구니 데이터 로드
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('장바구니 데이터 로드 실패:', error);
      return [];
    }
  });

  // 장바구니 데이터가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('장바구니 데이터 저장 실패:', error);
    }
  }, [cart]);

  // useCallback으로 함수 메모이제이션
  const addToCart = useCallback((product, selectedOptions) => {
    const cartItem = {
      id: `${product.id}-${selectedOptions.join('-')}`,
      product: product,
      options: selectedOptions,
      quantity: 1
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === cartItem.id
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, cartItem];
      }
    });
  }, []);

  const updateCartItemQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  }, []);

  // useMemo로 계산 결과 메모이제이션
  const total = useMemo(() => {
    return cart.reduce((total, item) => {
      const optionsPrice = item.options.reduce((sum, option) => {
        if (option === "샷 추가") return sum + 500;
        if (option === "시럽 추가") return sum + 0;
        return sum;
      }, 0);
      return total + (item.product.price + optionsPrice) * item.quantity;
    }, 0);
  }, [cart]);

  const handleOrder = useCallback(() => {
    if (cart.length === 0) return;
    
    alert("주문이 완료되었습니다!");
    setCart([]);
    // 주문 완료 후 로컬 스토리지에서도 장바구니 데이터 삭제
    localStorage.removeItem(CART_STORAGE_KEY);
  }, [cart.length]);

  return (
    <div className="order-screen">
      <div className="container">
        <div className="products-section">
          <h2>메뉴</h2>
          <div className="products-grid">
            {PRODUCTS.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
        
        <ShoppingCart
          cart={cart}
          onUpdateQuantity={updateCartItemQuantity}
          onOrder={handleOrder}
          total={total}
        />
      </div>
    </div>
  );
};

export default OrderScreen;
