import axios from "axios";

const api = axios.create({
  baseURL: process.env.BASE_URL, 
  headers: {
    "Accept": "application/json",
  },
});

export default api;

