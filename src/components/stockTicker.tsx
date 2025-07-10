import React, { useEffect, useState } from "react";
import { IStock } from "../interfaces";
import { getStocks, getMarketChart } from "../apiServices/stocks";

const StockTicker: React.FC = () => {
    const [stocks, setStocks] = useState<IStock[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response: IStock[] = await getStocks();
                const updated = await Promise.all(
                    response.map(async (stock) => {
                        try {
                            const chart = await getMarketChart(stock.id);
                            const prices = chart.prices;
                            const len = prices.length;

                            if (len >= 2) {
                                const latest = prices[len - 1][1];
                                const prev = prices[len - 2][1];
                                const change24h = latest - prev;

                                return {
                                    ...stock,
                                    current_price: latest,
                                    price_change_24h: change24h,
                                };
                            }

                            return stock;
                        } catch (err) {
                            console.warn(`Failed to fetch chart for ${stock.id}`);
                            return stock;
                        }
                    })
                );

                setStocks(updated);
            } catch (err) {
                console.warn("Falling back to mock stock data.");
            }
        };

        fetch();
        const interval = setInterval(fetch, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black overflow-hidden whitespace-nowrap py-2 rounded-lg shadow-lg">
            <div className="animate-marquee inline-block">
                {stocks.map((stock, idx) => (
                    <span key={idx} className="text-white mx-6 inline-flex items-center">
                        <span className="font-semibold mr-1">{stock.symbol.toUpperCase()}</span>
                        <span>${stock.current_price.toFixed(2)}</span>
                        <span
                            className={`ml-2 ${stock.price_change_24h > 0 ? "text-green-400" : "text-red-400"}`}
                        >
                            ({stock.price_change_24h > 0 ? "+" : ""}
                            {stock.price_change_24h.toFixed(2)})
                        </span>
                    </span>
                ))}
                {stocks.map((stock, idx) => (
                    <span key={`dup-${idx}`} className="text-white mx-6 inline-flex items-center">
                        <span className="font-semibold mr-1">{stock.symbol.toUpperCase()}</span>
                        <span>${stock.current_price.toFixed(2)}</span>
                        <span
                            className={`ml-2 ${stock.price_change_24h > 0 ? "text-green-400" : "text-red-400"}`}
                        >
                            ({stock.price_change_24h > 0 ? "+" : ""}
                            {stock.price_change_24h.toFixed(2)})
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StockTicker;
