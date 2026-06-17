const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.get("/track/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("TRACK ORDER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;