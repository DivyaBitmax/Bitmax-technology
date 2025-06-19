// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/adminMiddleware"); // token validator
const { adminLogin } = require("../controllers/adminController");


router.post("/login", adminLogin);

router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome, Admin", admin: req.admin });
});

module.exports = router;
