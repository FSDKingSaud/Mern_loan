const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    can: {
      type: [String],
      default: [],
    },
    shouldNotSee: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
