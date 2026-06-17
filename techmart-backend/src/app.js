const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "TechMart API running 🚀",
    version: "1.0.0",
  });
});

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders.user");
const userRoutes = require("./routes/users");
const couponRoutes = require("./routes/coupons");
const contactRoutes = require("./routes/contact");
const paymentRoutes = require("./routes/payment");
const analyticsRoutes = require("./routes/analytics");
const trackOrderRoutes = require("./routes/TrackOrder");
const ordersUserRoutes = require("./routes/orders.user");
const AdminRoutes = require("./routes/Admin");


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orders", trackOrderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", require("./routes/orders.user"));
app.use("/api/Admin", AdminRoutes);
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ TechMart API running on port ${PORT}`);
});