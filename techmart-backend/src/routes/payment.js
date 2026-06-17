const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

  const {
  name,
  email,
  phone,
  items,
  paymentMethod,
  discount = 0,
  shippingFee = 0,
  tax = 0,
} = req.body;
    console.log("Payment request received:", req.body);

    // 🧾 ORDER NUMBER
    const orderNumber = "ORD-" + Date.now();

    // 🧠 CALCULATE SUBTOTAL
    const subtotal = items.reduce(
      (sum, p) => sum + Number(p.price) * Number(p.qty),
      0
    );

    const total = subtotal - discount + shippingFee + tax;
    

    // 1️⃣ CREATE ORDER (ONLY ONCE)
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        paymentMethod,
        status: "PAID",

        items: {
  create: items.map(i => ({
    name: i.name,
    qty: Number(i.qty),
    price: Number(i.price),
    productId: i.productId?.toString(),
  }))
        },
      },
      include: {
        items: true,
      },
    });
    const productsHtml = items
  .map(
    i => `
      <tr>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>$${i.price}</td>
      </tr>
    `
  )
  .join("");
  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: `TechMart Order Confirmation - ${orderNumber}`,

  html: `
    <h2>Thank you for your order, ${name}!</h2>

    <p>Your payment was successful.</p>

    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>

    <table border="1" cellpadding="8" cellspacing="0">
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
      </tr>

      ${productsHtml}
    </table>

    <br/>

    <p><strong>Subtotal:</strong> $${subtotal}</p>
    <p><strong>Discount:</strong> $${discount}</p>
    <p><strong>Shipping:</strong> $${shippingFee}</p>
    <p><strong>Tax:</strong> $${tax}</p>

    <h3>Total: $${total}</h3>

    <p>
      Thank you for shopping with <strong>TechMart Rwanda</strong>.
    </p>
  `,
});

    console.log("ORDER CREATED:", order.id);

    return res.json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      orderNumber,
      total,
    });

  } catch (err) {
    console.error("PAYMENT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;