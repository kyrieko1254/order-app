import React, { useState, useCallback, useMemo, useEffect } from "react";
import "./OrderScreen.css";
import ProductCard from "./ProductCard";
import ShoppingCart from "./ShoppingCart";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const CART_STORAGE_KEY = 'cozy-cart';

const OrderScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // API에서 메뉴 데이터 가져오기
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/menus`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data.menus);
        } else {
          setError('메뉴 데이터를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('메뉴 데이터 로드 오류:', error);
        setError('서버 연결에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

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
      const optionsPrice = item.options.reduce((sum, optionName) => {
        // API에서 가져온 옵션 데이터에서 가격 찾기
        const optionData = item.product.options?.find(opt => opt.name === optionName);
        return sum + (optionData ? Number(optionData.price) : 0);
      }, 0);
      return total + (Number(item.product.price) + Number(optionsPrice)) * item.quantity;
    }, 0);
  }, [cart]);

  const handleOrder = useCallback(async () => {
    if (cart.length === 0) return;
    
    try {
      // 주문 데이터 준비
      const orderItems = cart.map(item => ({
        menu_id: item.product.id,
        quantity: item.quantity,
        selected_options: item.options
      }));

      // API로 주문 전송
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: orderItems })
      });

      const data = await response.json();
      
      if (data.success) {
        alert("주문이 성공적으로 완료되었습니다!");
        setCart([]);
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        alert(`주문 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('주문 처리 오류:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  }, [cart]);

  if (loading) {
    return (
      <div className="order-screen">
        <div className="container">
          <div className="loading">메뉴를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-screen">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-screen">
      <div className="container">
        <div className="products-section">
          <h2>메뉴</h2>
          <div className="products-grid">
            {products.map(product => (
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
