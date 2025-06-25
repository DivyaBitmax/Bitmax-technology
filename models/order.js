const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone: String,
  address: String,
  callDateTime: String,
  websiteType: String,
  otherWebsiteType: String,
  requirement: String,
  documentPath: String,
  plan: String,
  amount: Number,
  razorpayOrderId: String,
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
