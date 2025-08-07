import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import OrderScreen from "./components/OrderScreen";
import AdminScreen from "./components/AdminScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState("order");

  return (
    <div className="app">
      <Header currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      {currentScreen === "order" && <OrderScreen />}
      {currentScreen === "admin" && <AdminScreen />}
    </div>
  );
}

export default App;
