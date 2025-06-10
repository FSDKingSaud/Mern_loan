const express = require("express");
const ConsentCookie = require("../models/ConsentCookie");
const { authenticateStaffToken } = require("../middleware/auth");
const router = express.Router();

router.post("/accept", async (req, res) => {
  try {
    const { userAgent } = req.body;
    await ConsentCookie.create({
      accepted: true,
      userAgent,
    });
    res.status(200).json({ message: "Cookie consent accepted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/reject", async (req, res) => {
  try {
    const { userAgent } = req.body;
    await ConsentCookie.create({
      accepted: false,
      userAgent,
    });
    res.status(200).json({ message: "Cookie consent rejected" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.get("/stats", authenticateStaffToken, async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
    const totalCount = await ConsentCookie.countDocuments();
    const dailyCount = await ConsentCookie.countDocuments({ timestamp: { $gte: startOfDay } });
    const monthlyCount = await ConsentCookie.countDocuments({ timestamp: { $gte: startOfMonth } });
    const acceptedCookie = await ConsentCookie.countDocuments({ accepted: true });
    const rejectedCookie = await ConsentCookie.countDocuments({ accepted: false });
  
    res.json({ dailyCount, totalCount, monthlyCount, acceptedCookie, rejectedCookie});
  });
// export router
module.exports = router;
