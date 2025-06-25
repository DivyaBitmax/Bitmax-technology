const express = require("express");
const router = express.Router();
const {
  getDailySubmissions,
  getTotalSubmissions,
  getTodaysSubmissions
} = require("../controllers/statsController");

router.get("/daily-submissions", getDailySubmissions);           // already present
router.get("/total-submissions", getTotalSubmissions);           // new
router.get("/todays-submissions", getTodaysSubmissions);         // new

module.exports = router;
