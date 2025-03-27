import axios from "axios";
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.BASE_URL,  // .env dosyasındaki BASE_URL'i kullanıyoruz
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;

