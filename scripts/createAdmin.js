// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const Admin = require("../models/admin"); 
// const { MONGO_URI } = require("../config/config.js");


// async function createAdmin() {
//     console.log("MONGO_URI:", MONGO_URI);

//   await mongoose.connect(MONGO_URI);
  
//   const email = "admin@example.com";
//   const password = "admin123";
  
//   // Check if admin already exists
//   const existingAdmin = await Admin.findOne({ email });
//   if (existingAdmin) {
//     console.log("Admin already exists");
//     process.exit();
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   await Admin.create({ email, password: hashedPassword });

//   console.log(" Admin user created");
//   process.exit();
// }

// createAdmin();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const MONGO_URI = "mongodb+srv://divyasingh:divyasingh0612@cluster0.kkwfd2n.mongodb.net/bitmax-payments?retryWrites=true&w=majority&appName=Cluster0"
; // update here

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = "admin@example.com";
  const password = "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hashedPassword });
  console.log("Admin created:", admin);
  process.exit();
}
createAdmin();
