const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { type, subcat, search, sort, page = 1, limit = 20 } = req.query;

    const where = {};
    if (type)   where.type   = type;
    if (subcat) where.subcat = subcat;
    if (search) where.OR = [
      { name:  { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ];

    let orderBy = { createdAt: "desc" };
    if (sort === "price-asc")  orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "rating")     orderBy = { rating: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { specs: true },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/categories
router.get("/categories", async (req, res) => {
  try {
    const cats = await prisma.product.groupBy({
      by: ["subcat"],
      where: { type: "electronics", subcat: { not: null } },
      _count: { id: true },
    });
    res.json(cats.map(c => ({ subcat: c.subcat, count: c._count.id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { specs: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;