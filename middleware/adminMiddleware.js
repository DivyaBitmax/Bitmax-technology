const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

module.exports = verifyToken;
