const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { PORT } = require("./config/config");
const connectDB = require("./config/db");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created uploads directory");
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

connectDB();


app.use("/api/payments", require("./routes/paymentRoutes"));
//admin panel
app.use("/api/admin", require("./routes/adminRoutes"));

//login+register;
app.use('/api/auth', require('./routes/authRoutes'));

//daily form submission chart;
app.use("/api/stats", require("./routes/statsRoutes"));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
