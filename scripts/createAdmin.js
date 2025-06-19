const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const { MONGO_URI } = require("../config/config");

const email = "admin@example.com";         // 🔁 Replace with your email
const password = "admin123";               // 🔁 Replace with your password

mongoose.connect(MONGO_URI)
  .then(async () => {
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(" Admin already exists");
      return mongoose.disconnect();
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashed });
    await admin.save();
    console.log(" Admin created successfully");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(" Error creating admin:", err);
    mongoose.disconnect();
  });
