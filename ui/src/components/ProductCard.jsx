import React, { useState, useCallback } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const options = [
    { name: "샷 추가", price: 500 },
    { name: "시럽 추가", price: 0 }
  ];

  const handleOptionChange = useCallback((optionName) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionName)) {
        return prev.filter(option => option !== optionName);
      } else {
        return [...prev, optionName];
      }
    });
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (isAddingToCart) return; // 중복 클릭 방지
    
    setIsAddingToCart(true);
    
    try {
      onAddToCart(product, selectedOptions);
      setSelectedOptions([]);
      
      // 성공 피드백
      const btn = document.querySelector('.add-to-cart-btn');
      if (btn) {
        btn.textContent = '담기 완료!';
        setTimeout(() => {
          btn.textContent = '담기';
        }, 1000);
      }
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, selectedOptions, onAddToCart, isAddingToCart]);

  const calculatePrice = () => {
    const optionsPrice = selectedOptions.reduce((sum, option) => {
      const optionData = options.find(opt => opt.name === option);
      return sum + (optionData ? optionData.price : 0);
    }, 0);
    return product.price + optionsPrice;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {imageError ? (
          <div className="image-placeholder">
            <span>이미지 없음</span>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{calculatePrice().toLocaleString()}원</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-options">
          {options.map(option => (
            <label key={option.name} className="option-item">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.name)}
                onChange={() => handleOptionChange(option.name)}
              />
              <span className="option-text">
                {option.name} {option.price > 0 ? `(+${option.price}원)` : "(+0원)"}
              </span>
            </label>
          ))}
        </div>
        
        <button 
          className={`add-to-cart-btn ${isAddingToCart ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? '담는 중...' : '담기'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
