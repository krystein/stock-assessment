import axios from "axios";
import { IStock } from "../interfaces";
import {API_URL} from "../config/env";




export const getStocks = async (): Promise<IStock[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};


export const getMarketChart = async (id: string) => {
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
    {
      params: {
        vs_currency: "usd",
        days: 1,
      },
    },
  );
  return res.data;
};
