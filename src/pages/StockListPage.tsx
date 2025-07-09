import React, { useEffect, useState } from "react";
import { getStocks } from "../apiServices/stocks";
import { IStock } from "../interfaces";
import StockDetailModal from "../components/stockDetailModal";
import { useNavigate } from "react-router-dom";


const StockListPage = () => {
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [selectedStock, setSelectedStock] = useState<IStock | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getStocks();

        if (data && data.length > 0) {
          const unique = Array.from(
            new Map(data.map((item) => [item.id, item])).values()
          );
          setStocks(unique);
        } else {
          console.warn("Empty data received. Using mock data.");
        }
      } catch (error) {
        console.error("API failed. Using mock data:", error);
      }
    };

    fetchStocks();
  }, []);
  

  const handleOpenModal = (stock: IStock) => {
    setSelectedStock(stock);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 text-lg"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-bold text-gray-800">📈 Stock Tracker</h2>
        </div>

        <input
          type="text"
          placeholder="Search by symbol or name..."
          className="sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-5 py-3 text-left">Symbol</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Company</th>
              <th className="px-5 py-3 text-left">Price</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No stocks found.
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => (
                <tr
                  key={stock.id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="px-5 py-3 font-medium"><img src={stock.image} alt={stock.name} className="w-8 h-8" /></td>
                  <td className="px-5 py-3 font-medium">{stock.symbol}</td>
                  <td className="px-5 py-3">{stock.name}</td>
                  <td className="px-5 py-3">${stock.current_price.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 transition text-white py-1.5 px-4 rounded text-sm"
                      onClick={() => handleOpenModal(stock)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStock && (
        <StockDetailModal stock={selectedStock} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default StockListPage;
