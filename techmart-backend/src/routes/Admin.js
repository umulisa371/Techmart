const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const admin = require("../middleware/admin"); // ✅ correct

// temporary admin
const ADMIN = {
  email: "admin@techmart.com",
  password: "123456",
};

// LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN SECRET:", process.env.JWT_SECRET);

  if (email !== ADMIN.email || password !== ADMIN.password) {
    return res.json({
      success: false,
      message: "Invalid admin credentials",
    });
  }

  const token = jwt.sign(
    {
      email,
      isAdmin: true,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  console.log("TOKEN GENERATED:", token);

  return res.json({
    success: true,
    token,
  });
});

// STATS (PROTECTED)
router.get("/stats", admin, async (req, res) => {
  try {
    const users = await prisma.user.count();
    const orders = await prisma.order.count();

    const revenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
    });

    const products = await prisma.product.count();

    res.json({
      users,
      orders,
      revenue: revenueAgg._sum.total || 0,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/dashboard", admin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const revenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
    });

    res.json({
      users,
      orders,
      products,
      analytics: {
        users: users.length,
        orders: orders.length,
        products: products.length,
        revenue: revenueAgg._sum.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/products/:id", admin, async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/products/:id", admin, async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        price,
        stock,
      },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/orders/:id", admin, async (req, res) => {
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.json(order);
});

router.post("/products", admin, async (req, res) => {
  try {
    const { name, price, stock, image } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        image,
      },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/products/:id", admin, async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        price,
        stock,
      },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/products/:id", admin, async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/orders/:id", admin, async (req, res) => {
  try {
    console.log("ORDER ID RECEIVED:", req.params.id);
    console.log("STATUS:", req.body.status);

    const order = 
  await prisma.order.findMany({
  orderBy: {
    createdAt: "desc"
  },
  include: {
    user: true,
    items: true
  }
});

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});


module.exports = router;