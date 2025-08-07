import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import OrderScreen from "./components/OrderScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState("order");

  return (
    <div className="app">
      <Header currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      {currentScreen === "order" && <OrderScreen />}
      {currentScreen === "admin" && <div>관리자 화면 (추후 개발)</div>}
    </div>
  );
}

export default App;
