const mongoose = require("mongoose");

const CareerSchema = mongoose.Schema({
  jobtitle: String,
  description: String,
  deadline: String,
  dateposted: String,
  isClosed: {
    type: String,
    default: false,
  },
  image: String,
});

const Career = mongoose.model("Career", CareerSchema);
module.exports = Career;
