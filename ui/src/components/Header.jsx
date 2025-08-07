import React from "react";
import "./Header.css";

const Header = ({ currentScreen, setCurrentScreen }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="brand">
          <h1>COZY</h1>
        </div>
        <nav className="navigation">
          <button
            className={`nav-btn ${currentScreen === "order" ? "active" : ""}`}
            onClick={() => setCurrentScreen("order")}
          >
            주문하기
          </button>
          <button
            className={`nav-btn ${currentScreen === "admin" ? "active" : ""}`}
            onClick={() => setCurrentScreen("admin")}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
