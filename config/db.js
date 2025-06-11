const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");  

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log("MongoDB connected successfully");
      console.log(" MongoDB Atlas connected successfully");
      // Optional: show which DB is connected
    mongoose.connection.once("open", () => {
      console.log("🔗 Connected to DB:", mongoose.connection.name);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
