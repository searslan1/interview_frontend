import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  withCredentials: true, // Cookie'ler için gerekli
});

export default api;
