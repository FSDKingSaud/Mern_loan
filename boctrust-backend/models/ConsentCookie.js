const mongoos = require("mongoose");

const ConsentCookieSchema = mongoos.Schema({
  accepted: {
    type: Boolean,
    default: false,
  },
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

const ConsentCookie = mongoos.model("ConsentCookie", ConsentCookieSchema);
module.exports = ConsentCookie; // export inquiry model
