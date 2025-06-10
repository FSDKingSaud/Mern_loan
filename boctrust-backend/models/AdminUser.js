const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "https://shorturl.at/msvz7",
    }, // URL or file path to user's photo

    fullName: String, // Full name of the user

    email: {
      type: String,
      unique: true,
      required: true,
    },

    phone: String, // Phone number of the user
    username: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      // required: true,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Number,
      select: false,
    },
    userType: {
      type: String,
      enum: ["staff", "super_admin"],
      default: "staff",
    },
    userRole: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    token: String, // User's token
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
