import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export default API;
export const fetchWeather = (data) => API.post("/weather", data);
export const getRecords = () => API.get("/records");
export const updateRecord = (id, data) => API.put(`/records/${id}`, data);
export const deleteRecord = (id) => API.delete(`/records/${id}`);
export const exportRecords = () => API.get("/export");
export const getInsight = (id) => API.get(`/insight/${id}`);