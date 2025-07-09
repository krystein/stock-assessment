import React, { useEffect, useRef, useState } from "react";
import { IStock } from "../interfaces";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface StockDetailModalProps {
    stock: IStock;
    onClose: () => void;
}

const MAX_POINTS = 50;

const generateInitialData = (price: number) => {
    return Array.from({ length: MAX_POINTS }, () => ({
        time: new Date().toLocaleTimeString(),
        price,
    }));
};

const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
    const [data, setData] = useState(() => generateInitialData(stock.price));
    const priceRef = useRef(stock.price);

    useEffect(() => {
        const interval = setInterval(() => {
            const delta = (Math.random() - 0.5) * 4;
            const newPrice = Math.max(1, priceRef.current + delta);
            priceRef.current = newPrice;

            const newPoint = {
                time: new Date().toLocaleTimeString(),
                price: parseFloat(newPrice.toFixed(2)),
            };

            setData((prevData) => {
                const updated = [...prevData.slice(1), newPoint];
                return updated;
            });
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-md bg-white p-6 rounded shadow-lg">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-2">{stock.name}</h2>
                <p className="text-sm text-gray-600 mb-2">Symbol: {stock.symbol}</p>
                <p className="text-lg mb-4">Live Price: ${priceRef.current.toFixed(2)}</p>

                <div style={{ width: "100%", height: 250 }}>
                    <ResponsiveContainer>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                            <YAxis domain={["auto", "auto"]} />
                            <Tooltip
                                formatter={(value: number) => `$${value.toFixed(2)}`}
                                labelFormatter={(label: string) => `Time: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StockDetailModal;
