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
  console.log(" LOGIN CALL:", { email, password });

  const admin = await Admin.findOne({ email });
  console.log(" Admin fetched from DB:", admin);

  if (!admin) {
    return res.status(401).json({ success: false, message: "Invalid credentials (no admin)" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  console.log(" Password match result:", isMatch);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials (wrong password)" });
  }

  // Agar tak yahi tak pahunch gaya to login successful hona chahiye
  console.log(" Password correct, proceeding to login");
  
  const token = jwt.sign({ id: admin._id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });

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
