import api from "./api";

export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (productId) =>
  api.post(`/wishlist/add/${productId}`);
export const removeFromWishlist = (productId) =>
  api.delete(`/wishlist/remove/${productId}`);
