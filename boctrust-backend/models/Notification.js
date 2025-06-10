const mongoose = require("mongoose")

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["User", "Customer"],
      default: "User",
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["loan", "topuploan", "inquiries", "jobApplication", "overdueLoan", "payment", "account", "system"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: { type: Object },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification; 
