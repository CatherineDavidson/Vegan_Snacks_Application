export async function apiRequest(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof data === "string" ? data : (data?.message || "Request failed");
    throw new Error(msg);
  }
  return data;
}

// Convenience endpoints that exist in backend:
export const AuthAPI = {
  me: () => apiRequest("/auth/me"),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  // NOTE: do not include login/register here to avoid clashing with your existing files.
};

export const ProductsAPI = {
  list: () => apiRequest("/products"),
  get: (id) => apiRequest(`/products/${id}`),
  search: (q) => apiRequest(`/products/search?q=${encodeURIComponent(q)}`),
  categories: () => apiRequest("/products/categories"),
};

export const CartAPI = {
  get: (userId) => apiRequest(`/products/cart/${userId}`),
  add: (userId, productId, qty=1) => apiRequest(`/products/cart/${userId}/add/${productId}?qty=${qty}`, { method: "POST" }),
  update: (cartItemId, qty) => apiRequest(`/products/cart/item/${cartItemId}`, { method:"PUT", body: JSON.stringify({ quantity: qty }) }),
  remove: (cartItemId) => apiRequest(`/products/cart/item/${cartItemId}`, { method:"DELETE" }),
  clear: (userId) => apiRequest(`/products/cart/${userId}`, { method:"DELETE" }),
};

export const OrdersAPI = {
  place: (userId) => apiRequest(`/orders/${userId}`, { method: "POST" }),
  list: (userId) => apiRequest(`/orders/${userId}`),
};

export const CategoryAPI = {
  list: () => apiRequest("/category"),
  create: (payload) => apiRequest("/category", { method:"POST", body: JSON.stringify(payload) }),
};

export const ContactAPI = {
  create: (payload) => apiRequest("/contact", { method:"POST", body: JSON.stringify(payload) }),
};
