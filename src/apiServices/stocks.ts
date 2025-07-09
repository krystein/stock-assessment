import axios from "axios";
import { IStock } from "../interfaces";


const API_URL = "https://api.example.com/stocks";

export const getStocks = async (): Promise<IStock[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};
