// src/api.js — drop this into your React frontend src/ folder
// Replace VITE_API_URL in your .env with your backend URL

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const headers = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token")
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : {}),
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (name, email, password) =>
  req("POST", "/auth/register", { name, email, password });

export const login = (email, password) =>
  req("POST", "/auth/login", { email, password });

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return req("GET", `/products?${qs}`);
};

export const getProduct = (id) => req("GET", `/products/${id}`);

// ── Cart ──────────────────────────────────────────────────────────────────────
export const getCart       = ()              => req("GET",    "/cart");
export const addToCart     = (productId, qty=1) => req("POST", "/cart", { productId, qty });
export const updateCartQty = (id, qty)       => req("PATCH",  `/cart/${id}`, { qty });
export const removeFromCart= (id)            => req("DELETE", `/cart/${id}`);
export const clearCart     = ()              => req("DELETE", "/cart");

// ── Wishlist ──────────────────────────────────────────────────────────────────
export const getWishlist      = ()          => req("GET",  "/cart/wishlist");
export const toggleWishlist   = (productId) => req("POST", "/cart/wishlist/toggle", { productId });

// ── Orders ────────────────────────────────────────────────────────────────────
export const placeOrder  = (payload)      => req("POST", "/orders", payload);
export const getOrders   = ()             => req("GET",  "/orders");
export const trackOrder  = (orderNumber)  => req("GET",  `/orders/track/${orderNumber}`);

// ── Coupons ───────────────────────────────────────────────────────────────────
export const validateCoupon = (code, subtotal) =>
  req("POST", "/coupons/validate", { code, subtotal });

// ── User ──────────────────────────────────────────────────────────────────────
export const getMe    = ()      => req("GET",   "/users/me");
export const updateMe = (data)  => req("PATCH", "/users/me", data);
