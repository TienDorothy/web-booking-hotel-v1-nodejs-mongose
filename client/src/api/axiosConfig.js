import axios from "axios";

// const BASE_URL = ' http://localhost:5001/api'
const BASE_URL = process.env.REACT_APP_SERVER_URL
const token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null;

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
});

export default axiosConfig;
