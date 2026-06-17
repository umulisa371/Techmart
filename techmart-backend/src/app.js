const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://techmart-sable.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.options("*", cors());

app.use(express.json());
// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");

const userRoutes = require("./routes/users");
const couponRoutes = require("./routes/coupons");
const contactRoutes = require("./routes/contact");
const paymentRoutes = require("./routes/payment");
const analyticsRoutes = require("./routes/analytics");
const trackOrderRoutes = require("./routes/TrackOrder");
const ordersUserRoutes = require("./routes/orders.user");
const adminRoutes = require("./routes/admin");


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

app.use("/api/admin", adminRoutes);
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ TechMart API running on port ${PORT}`);
});