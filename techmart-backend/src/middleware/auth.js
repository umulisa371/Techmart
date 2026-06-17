const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No token provided",
    });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(decoded);
    console.log("Authenticated user:", decoded.userId);

    req.user = {
      id: decoded.userId,
    };

    next();

  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};