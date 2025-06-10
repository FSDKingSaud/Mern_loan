const { getIo } = require("../utils/socketIo");
const Notification = require("../models/Notification");
const Customer = require("../models/Customer");
const AdminUser = require("../models/AdminUser");

const handleNotificationPaginationSearchSortFilter = (query) => {
  let { search, type, isRead, sortBy, page, limit } = query;

  const filter = {};

  if (type && type != "all") {
    filter.type = type;
  }
  if (isRead) {
    filter.isRead = isRead == "true" ? true : false;
  }

  if (search) {
    filter.$or = [{ message: { $regex: search, $options: "i" } }];
  }

  let sortOptions = {};
  switch (sortBy) {
    case "newest":
      sortOptions.createdAt = -1;
      break;
    case "oldest":
      sortOptions.createdAt = -1;
      break;
    default:
      sortOptions.createdAt = -1; // Default: Newest first
  }

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  return {
    sortOptions,
    filter,
    pageNumber,
    pageSize,
    skip,
  };
};

// you can sither pass target or role, not both
const getUsersToSendNotificationFromTarget = async (target, role, userId) => {
  let usersToSend = [];

  if (target) {
    if (target === "admins") {
      usersToSend = await AdminUser.find();
    } else if (target === "customers") {
      usersToSend = await Customer.find({
        userType: UserTypes.customer,
      });
    }
  }

  if (role) {
    usersToSend = await AdminUser.find({
      userRole: role,
    });
  }

  if (userId) {
    let user = await AdminUser.findById(userId);
    if (!user) {
      user = await Customer.findById(userId);
    }
    usersToSend.push(user);
  }

  return usersToSend;
};

const saveAndSendNotification = async ({
  targetUsers,
  message,
  type,
  metadata,
}) => {
  const io = getIo();

  const notificationsToSend = targetUsers.map((user) => ({
    userId: user._id,
    message: message,
    type: type,
    isRead: false,
    metadata: metadata,
  }));

  const insertedNotifications = await Notification.insertMany(
    notificationsToSend,
    { ordered: false }
  );

  // Send real-time notifications in batches (avoid blocking event loop)
  const CHUNK_SIZE = 100; // Process in batches of 100
  for (let i = 0; i < insertedNotifications.length; i += CHUNK_SIZE) {
    const batch = insertedNotifications.slice(i, i + CHUNK_SIZE);
    batch.forEach((notification) => {
      io.to(notification.userId.toString()).emit("newNotification", {
        _id: notification._id,
        message: notification.message,
        metadata: notification.metadata,
      });
    });

    // Add a small delay to prevent performance issues
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return true;
};

const saveAndSendNotificationToUser = async ({
  userType,
  userId,
  message,
  type,
  metadata,
}) => {
  const io = getIo();

  const notificationsToSend = {
    userId,
    message,
    userType,
    type: type,
    isRead: false,
    metadata: metadata,
  };

  const insertedNotification = await Notification.create(notificationsToSend);

  io.to(insertedNotification.userId.toString()).emit("newNotification", {
    _id: insertedNotification._id,
    message: insertedNotification.message,
    metadata: insertedNotification.metadata,
  });

  return true;
};

module.exports = {
  handleNotificationPaginationSearchSortFilter,
  saveAndSendNotification,
  saveAndSendNotificationToUser,
  getUsersToSendNotificationFromTarget,
};
