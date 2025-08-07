import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { name: "샷 추가", price: 500 },
    { name: "시럽 추가", price: 0 }
  ];

  const handleOptionChange = (optionName) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionName)) {
        return prev.filter(option => option !== optionName);
      } else {
        return [...prev, optionName];
      }
    });
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedOptions);
    setSelectedOptions([]);
  };

  const calculatePrice = () => {
    const optionsPrice = selectedOptions.reduce((sum, option) => {
      const optionData = options.find(opt => opt.name === option);
      return sum + (optionData ? optionData.price : 0);
    }, 0);
    return product.price + optionsPrice;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
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
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          담기
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
