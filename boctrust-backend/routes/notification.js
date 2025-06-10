const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const {
  handleNotificationPaginationSearchSortFilter,
} = require("../services/notification.service");

router.get("/", async (req, res) => {
  try {
    const { sortOptions, filter, pageNumber, pageSize, skip } =
      handleNotificationPaginationSearchSortFilter(req.query);

    const userId = req.user._id;
    const myNotifications = await Notification.find({
      userId: userId,
      ...filter,
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const totalNotifications = await Notification.countDocuments({
      userId: userId,
      ...filter,
    });
    const totalPages = Math.ceil(totalNotifications / pageSize);

    res.status(200).json({
      isSuccess: true,
      message: "Notifications Retrieved Successfully",
      data: {
        notifications: myNotifications,
        totalNotifications,
        page: pageNumber,
        totalPages,
        limit: pageSize,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/mark-as-read", async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      isSuccess: true,
      message: "Notifications Make as Read Successfully",
      data: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;