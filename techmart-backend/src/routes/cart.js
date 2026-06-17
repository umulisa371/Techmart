const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/cart
router.get("/", authMiddleware, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: { include: { specs: true } } },
  });
  res.json(items);
});

// POST /api/cart
router.post("/", authMiddleware, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.userId, productId } },
  });
  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { qty: existing.qty + qty },
      include: { product: true },
    });
    return res.json(updated);
  }
  const item = await prisma.cartItem.create({
    data: { userId: req.userId, productId, qty },
    include: { product: true },
  });
  res.status(201).json(item);
});

// PATCH /api/cart/:id
router.patch("/:id", authMiddleware, async (req, res) => {
  const { qty } = req.body;
  if (qty <= 0) {
    await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
    return res.json({ deleted: true });
  }
  const item = await prisma.cartItem.update({
    where: { id: Number(req.params.id) },
    data: { qty },
    include: { product: true },
  });
  res.json(item);
});

// DELETE /api/cart/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Item removed" });
});

// DELETE /api/cart
router.delete("/", authMiddleware, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.userId } });
  res.json({ message: "Cart cleared" });
});

// GET /api/cart/wishlist
router.get("/wishlist", authMiddleware, async (req, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.userId },
    include: { product: { include: { specs: true } } },
  });
  res.json(items);
});

// POST /api/cart/wishlist/toggle
router.post("/wishlist/toggle", authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: req.userId, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return res.json({ added: false });
  }
  await prisma.wishlistItem.create({ data: { userId: req.userId, productId } });
  res.json({ added: true });
});

module.exports = router;