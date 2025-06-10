const mongoose = require("mongoose");

const boardMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  profileImg: {type: String, default: "images/profilePlaceholder.jpg"},
  biography: { type: [String], required: true },
});

const BoardMember = mongoose.model("BoardMember", boardMemberSchema);

module.exports = BoardMember;
