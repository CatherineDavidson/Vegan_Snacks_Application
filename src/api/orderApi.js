import api from "./api";

export const placeOrder = () => api.post("/orders");
export const getOrders = () => api.get("/orders");
