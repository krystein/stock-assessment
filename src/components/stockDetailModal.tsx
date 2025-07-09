import React, { useEffect, useState } from "react";
import { ChartPoint, ChartType, IStock, StockDetailModalProps } from "../interfaces";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { getMarketChart } from "../apiServices/stocks";
import { formatNumberAbbrev } from "./formatter";


const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
    const [chartData, setChartData] = useState<ChartPoint[]>([]);
    const [livePrice, setLivePrice] = useState<number>(stock.current_price);
    const [loading, setLoading] = useState<boolean>(true);
    const [chartType, setChartType] = useState<ChartType>("price");

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                const { prices, market_caps, total_volumes } = await getMarketChart(stock.id);

                const formatted = prices.map(([timestamp, price]: [number, number], index: number) => ({
                    time: new Date(timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    price: parseFloat(price.toFixed(2)),
                    marketCap: market_caps[index]?.[1] ?? 0,
                    volume: total_volumes[index]?.[1] ?? 0,
                }));

                setChartData(formatted);
                setLivePrice(prices[prices.length - 1][1]);
            } catch (err) {
                console.error("Error loading chart data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [stock.id]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-2xl bg-white p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>

                <div className="flex items-center gap-4 mb-4">
                    <img src={stock.image} alt={stock.name} className="w-10 h-10" />
                    <div>
                        <h2 className="text-2xl font-bold">{stock.name}</h2>
                        <p className="text-sm text-gray-600">Symbol: {stock.symbol.toUpperCase()}</p>
                    </div>
                </div>

                <p className="text-xl font-semibold mb-4">Live Price: ${livePrice.toFixed(2)}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-800 mb-6">
                    <div><span className="font-medium">High 24h:</span> ${stock.high_24h.toFixed(2)}</div>
                    <div><span className="font-medium">Low 24h:</span> ${stock.low_24h.toFixed(2)}</div>
                    <div>
                        <span className="font-medium">24h Change:</span>{" "}
                        <span className={stock.price_change_24h >= 0 ? "text-green-500" : "text-red-500"}>
                            {stock.price_change_percentage_24h.toFixed(2)}%
                        </span>
                    </div>
                    <div><span className="font-medium">Market Cap:</span> ${stock.market_cap.toLocaleString()}</div>
                    <div><span className="font-medium">Volume:</span> ${stock.total_volume.toLocaleString()}</div>
                    <div><span className="font-medium">Rank:</span> #{stock.market_cap_rank}</div>
                    <div><span className="font-medium">Circulating Supply:</span> {stock.circulating_supply.toLocaleString()}</div>
                    <div><span className="font-medium">Total Supply:</span> {stock.total_supply?.toLocaleString() || "N/A"}</div>
                    <div><span className="font-medium">Max Supply:</span> {stock.max_supply?.toLocaleString() || "N/A"}</div>
                    <div><span className="font-medium">ATH:</span> ${stock.ath.toLocaleString()}</div>
                    <div><span className="font-medium">ATH Change:</span> {stock.ath_change_percentage.toFixed(2)}%</div>
                    <div><span className="font-medium">ATL:</span> ${stock.atl.toLocaleString()}</div>
                </div>

                {/* Toggle Buttons */}
                <div className="flex gap-4 mb-4 justify-center">
                    <button
                        onClick={() => setChartType("price")}
                        className={`px-3 py-1 rounded ${chartType === "price" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    >
                        Price
                    </button>
                    <button
                        onClick={() => setChartType("volume")}
                        className={`px-3 py-1 rounded ${chartType === "volume" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    >
                        Volume
                    </button>
                    <button
                        onClick={() => setChartType("marketCap")}
                        className={`px-3 py-1 rounded ${chartType === "marketCap" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    >
                        Market Cap
                    </button>
                </div>
                <div style={{ width: "100%", height: 250 }}>
                    {loading ? (
                        <p className="text-center text-sm text-gray-500">Loading chart...</p>
                    ) : (
                        <ResponsiveContainer>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                <YAxis
                                    domain={["auto", "auto"]}
                                    tickFormatter={(value: number) =>
                                        chartType === "price" ? `$${value}` : formatNumberAbbrev(value)
                                    }
                                />
                                <Tooltip
                                    formatter={(value: number) =>
                                        chartType === "price"
                                            ? `$${value.toFixed(2)}`
                                            : formatNumberAbbrev(value)
                                    }
                                    labelFormatter={(label: string) => `Time: ${label}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={chartType}
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>

                    )}
                </div>
            </div>
        </div>
    );
};

export default StockDetailModal;
