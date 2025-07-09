import React from "react";
import StockTicker from "../components/stockTicker";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Real-Time Stock Tracker</h1>
      <p>Track your favorite stocks with real-time updates and charts.</p>
      <StockTicker />
      <button className="bg-gray-500 text-white my-5 p-6 font-bold rounded-lg" onClick={() => navigate("/stocks")}>Go to Stock List</button>
    </div>
  );
};

export default LandingPage;
