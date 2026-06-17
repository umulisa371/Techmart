const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token")
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : {}),
});

const request = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ── Auth ──────────────────────────────────────────────────────
export const register = (name, email, password) =>
  request("POST", "/auth/register", { name, email, password });

export const login = (email, password) =>
  request("POST", "/auth/login", { email, password });

// ── Products ──────────────────────────────────────────────────
export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request("GET", `/products?${qs}`);
};

export const getProduct = (id) => request("GET", `/products/${id}`);

// ── Cart ──────────────────────────────────────────────────────
export const getCart        = ()                => request("GET",    "/cart");
export const addToCart      = (productId, qty)  => request("POST",   "/cart", { productId, qty });
export const updateCartItem = (id, qty)         => request("PATCH",  `/cart/${id}`, { qty });
export const removeCartItem = (id)              => request("DELETE", `/cart/${id}`);
export const clearCart      = ()                => request("DELETE", "/cart");

// ── Wishlist ──────────────────────────────────────────────────
export const getWishlist     = ()          => request("GET",  "/cart/wishlist");
export const toggleWishlist  = (productId) => request("POST", "/cart/wishlist/toggle", { productId });

// ── Orders ────────────────────────────────────────────────────
export const placeOrder  = (payload)     => request("POST", "/orders", payload);
export const getOrders   = ()            => request("GET",  "/orders");
export const trackOrder  = (orderNumber) => request("GET",  `/orders/track/${orderNumber}`);

// ── Coupons ───────────────────────────────────────────────────
export const validateCoupon = (code, subtotal) =>
  request("POST", "/coupons/validate", { code, subtotal });

// ── Analytics ─────────────────────────────────────────────────
export const getAnalytics = () => request("GET", "/analytics/dashboard");

// ── User ──────────────────────────────────────────────────────
export const getMe    = ()     => request("GET",   "/users/me");
export const updateMe = (data) => request("PATCH", "/users/me", data);