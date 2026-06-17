const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.get("/", async (req, res) => {
  try {
    // 1. Get all orders
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    });

    // 2. Basic stats
    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    const paidOrders = orders.filter(o => o.status === "PAID").length;
    const pendingOrders = orders.filter(o => o.status === "PENDING").length;

    const averageOrderValue =
      totalOrders === 0 ? 0 : totalRevenue / totalOrders;

    // 3. Top products (from OrderItem)
    const productMap = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = {
            productId: item.productId,
            qty: 0,
            revenue: 0,
          };
        }

        productMap[item.productId].qty += item.qty;
        productMap[item.productId].revenue += item.qty * item.price;
      });
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 4. Return analytics
    return res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue,
        paidOrders,
        pendingOrders,
        averageOrderValue,
        topProducts,
      },
    });

  } catch (err) {
    console.error("ANALYTICS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;