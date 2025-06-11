const express  = require("express");
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const Admin    = require("../models/admin");
const Order    = require("../models/order");
const config   = require("../config/config");

const router = express.Router();

/* --------------------  ADMIN LOGIN  -------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  //7 day token
  const token = jwt.sign({ id: admin._id }, config.JWT_SECRET, { expiresIn: "15d" });

  /* Return token plain; client must add the Bearer prefix when sending it back */
  res.json({ success: true, token });
});

/* --------------------  AUTH MIDDLEWARE  -------------------- */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  // Accept both  "Bearer <token>"  and just "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.adminId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/* --------------------  VIEW ORDERS  -------------------- */
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});
module.exports = router;
