const express = require("express");
const router = express.Router();
const {
  getDailySubmissions,
  getTotalSubmissions,
  getTodaysSubmissions,
  getTotalPayments,      // newly added
  getTodaysPayments      // newly added
} = require("../controllers/statsController");

router.get("/daily-submissions", getDailySubmissions);           // already present
router.get("/total-submissions", getTotalSubmissions);           // new
router.get("/todays-submissions", getTodaysSubmissions);         // new
router.get("/total-payments", getTotalPayments);        // new route
router.get("/todays-payments", getTodaysPayments);      // new route
module.exports = router;
