import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StockListPage from "./pages/StockListPage";
import LandingPage from "./pages/LandingPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/stocks" element={<StockListPage />} />
    </Routes>
  </Router>
);

export default App;
