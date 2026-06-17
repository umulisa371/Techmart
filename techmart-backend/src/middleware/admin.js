const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: err.message });
  }
};