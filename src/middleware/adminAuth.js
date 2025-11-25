const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Admin token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: "Admin access only" });
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
