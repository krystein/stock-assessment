import React, { useEffect, useState } from "react";
import { IStock } from "../interfaces";
import { getStocks } from "../apiServices/stocks";

const generateChange = () => (Math.random() * 4 - 2).toFixed(2);

const StockTicker: React.FC = () => {
    const [stocks, setStocks] = useState<IStock[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await getStocks();
                const updated = response.map((stock) => ({
                    ...stock,
                    change: parseFloat(generateChange()),
                }));
                setStocks(updated);
            } catch {
                console.warn("Falling back to mock stock data.");
                setStocks([
                    { symbol: "AAPL", name: "Apple Inc.", price: 190, change: +0.45 },
                    { symbol: "GOOGL", name: "Alphabet Inc.", price: 134, change: -0.65 },
                    { symbol: "TSLA", name: "Tesla Inc.", price: 245, change: +1.2 },
                    { symbol: "AAPL", name: "Apple Inc.", price: 190, change: +0.45 },
                    { symbol: "GOOGL", name: "Alphabet Inc.", price: 134, change: -0.65 },
                    { symbol: "TSLA", name: "Tesla Inc.", price: 245, change: +1.2 },
                ]);
            }
        };

        fetch();
        const interval = setInterval(fetch, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black overflow-hidden whitespace-nowrap py-2">
            <div className="animate-marquee inline-block">
                {stocks.map((stock, idx) => (
                    <span key={idx} className="text-white mx-6 inline-flex items-center">
                        <span className="font-semibold mr-1">{stock.symbol}</span>
                        <span>${stock.price.toFixed(2)}</span>
                        <span
                            className={`ml-2 ${stock.change ?? 0 > 0 ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            ({(stock.change ?? 0) > 0 ? "+" : ""}
                            {stock.change ?? 0})
                        </span>
                    </span>
                ))}
                {/* Duplicate for seamless loop */}
                {stocks.map((stock, idx) => (
                    <span key={`dup-${idx}`} className="text-white mx-6 inline-flex items-center">
                        <span className="font-semibold mr-1">{stock.symbol}</span>
                        <span>${stock.price.toFixed(2)}</span>
                        <span
                            className={`ml-2 ${stock.change ?? 0 > 0 ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            ({stock.change ?? 0 > 0 ? "+" : ""}
                            {stock.change})
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StockTicker;
