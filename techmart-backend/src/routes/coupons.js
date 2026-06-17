const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/coupons/validate
router.post("/validate", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), active: true },
    });
    if (!coupon) return res.status(404).json({ error: "Invalid coupon code" });
    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return res.status(400).json({ error: "Coupon has expired" });
    if (coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ error: "Coupon usage limit reached" });

    const discount = coupon.isPercent
      ? subtotal * coupon.discount
      : Math.min(coupon.discount, subtotal);

    res.json({ valid: true, discount, code: coupon.code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;