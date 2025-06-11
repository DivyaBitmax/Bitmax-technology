// const express = require("express");
// const Razorpay = require("razorpay");
// const Order = require("../models/order");
// const multer = require("multer");
// const config = require("../config/config");

// const router = express.Router();

// // Multer setup for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // Razorpay instance using config
// const razorpay = new Razorpay({
//   key_id: config.RAZORPAY_KEY_ID,
//   key_secret: config.RAZORPAY_KEY_SECRET,
// });

// router.post("/create-order", upload.single("document"), async (req, res) => {
//   try {
//     const {
//       fullname,
//       email,
//       phone,
//       address,
//       callDateTime,
//       websiteType,
//       otherWebsiteType,
//       requirement,
//       plan,
//       amount,
//     } = req.body;

//     const finalType = websiteType === "other" ? otherWebsiteType : websiteType;
//     const filePath = req.file ? req.file.path : "";

//     const paymentOptions = {
     
//       amount: parseInt(amount),
//       currency: "INR",
//       receipt: `receipt_order_${Date.now()}`,
//       payment_capture: 1,
//     };

//     const razorpayOrder = await razorpay.orders.create(paymentOptions);

//     const newOrder = new Order({
//       fullname,
//       email,
//       phone,
//       address,
//       callDateTime,
//       websiteType: finalType,
//       requirement,
//       documentPath: filePath,
//       plan,
//       amount: rupees,
//       // amount: parseInt(amount),
//       razorpayOrderId: razorpayOrder.id,
//     });

//     await newOrder.save();

//     res.json({
//       success: true,
//       razorpayKey: config.RAZORPAY_KEY_ID,
//       orderId: razorpayOrder.id,
//       amount: paymentOptions.amount,
//     });
//   } catch (error) {
//     console.error("Order Creation Error:", error);
//     res.status(500).json({ success: false, message: "Order creation failed" });
//   }
// });

// module.exports = router;




const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../models/order");
const multer = require("multer");
const config = require("../config/config");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Razorpay instance using config
const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", upload.single("document"), async (req, res) => {
  try {
    console.log("Form received:", req.body);
    console.log("File received:", req.file);
    console.log("Amount:", req.body.amount);

    const {
      fullname,
      email,
      phone,
      address,
      callDateTime,
      websiteType,
      otherWebsiteType,
      requirement,
      plan,
      amount,
    } = req.body;

    // Amount must be a number and valid
    const finalAmount = parseInt(amount);
    if (isNaN(finalAmount) || finalAmount < 100) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    });

    const newOrder = new Order({
      fullname,
      email,
      phone,
      address,
      callDateTime,
      websiteType: websiteType === "other" ? otherWebsiteType : websiteType,
      requirement,
      documentPath: req.file ? req.file.path : "",
      plan,
      amount: finalAmount,
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.json({
      success: true,
      razorpayKey: config.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});



// GET  /orders  
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({ success: false, message: "Could not fetch orders" });
  }
});


// routes/payments.js
module.exports = router;