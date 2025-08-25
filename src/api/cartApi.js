import api from "./api";

export const getCart = () => api.get("/cart");
export const addToCart = (productId, quantity) =>
  api.post("/cart/add", { productId, quantity });
export const removeFromCart = (cartItemId) =>
  api.delete(`/cart/remove/${cartItemId}`);
export const clearCart = () => api.delete("/cart/clear");
