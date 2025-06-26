const Order = require("../models/order");

exports.getDailySubmissions = async (req, res) => {
  try {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 6); // last 7 days

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const submissionsCount = orders.find((o) => o._id === dateStr)?.count || 0;

      result.push({
        date: dateStr,
        submissions: submissionsCount,
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Daily Submissions Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ 1. Total Form Submissions
exports.getTotalSubmissions = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    res.json({ success: true, totalSubmissions: total });
  } catch (error) {
    console.error("Error getting total submissions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ 2. Today's Form Submissions
exports.getTodaysSubmissions = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayCount = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    res.json({ success: true, todaysSubmissions: todayCount });
  } catch (error) {
    console.error("Error getting today’s submissions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





//  Total Paid Orders (all-time)
exports.getTotalPayments = async (req, res) => {
  try {
    const totalPaid = await Order.countDocuments({ isPaid: true });
    res.json({ success: true, totalPayments: totalPaid });
  } catch (error) {
    console.error("Error getting total payments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//  Today's Payments
exports.getTodaysPayments = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todaysPaid = await Order.countDocuments({
      isPaid: true,
      createdAt: { $gte: start, $lte: end }
    });

    res.json({ success: true, todaysPayments: todaysPaid });
  } catch (error) {
    console.error("Error getting today's payments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
