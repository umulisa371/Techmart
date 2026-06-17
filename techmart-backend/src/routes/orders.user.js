
const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

// CREATE ORDER (USER)
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      items,
      total,
      paymentMethod,
      discount = 0,
      shippingFee = 0,
    } = req.body;

    const orderNumber = "ORD-" + Date.now();

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        total,
        discount,
        shippingFee,
        paymentMethod,
        status: "PAID",

        items: {
          create: items.map(i => ({
            name: i.name,
            qty: Number(i.qty),
            price: Number(i.price),
            productId: i.productId || null,
          })),
        },
      },
      include: { items: true },
    });

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, orders });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;