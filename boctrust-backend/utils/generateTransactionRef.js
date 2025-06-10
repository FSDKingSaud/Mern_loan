const crypto = require("crypto");

const generateTransactionRef = () => {
  const timestamp = Date.now().toString(36).slice(2, 4); // Convert timestamp to base-36
  const random = Math.random().toString(36).slice(2, 4); // Generate random string
  return `${timestamp}${random}`;
};

function generateTransactionRid() {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomStr = crypto.randomBytes(10).toString("hex"); // Generate 4-byte random hex string
  return `TXN-${timestamp}-${randomStr}`.toUpperCase().slice(0, 30); // Format and return RID
}

function formatDateYYMMDDHHMMSS(date = new Date()) {
  const yy = String(date.getFullYear()).slice(2); // Get last two digits of year
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month (01-12)
  const dd = String(date.getDate()).padStart(2, "0"); // Day (01-31)
  const hh = String(date.getHours()).padStart(2, "0"); // Hours (00-23)
  const min = String(date.getMinutes()).padStart(2, "0"); // Minutes (00-59)
  const ss = String(date.getSeconds()).padStart(2, "0"); // Seconds (00-59)

  return `${yy}${mm}${dd}${hh}${min}${ss}`;
}
function generateEasyPayTransactionId(clientCode) {
  const timestamp = formatDateYYMMDDHHMMSS();
  const randomInt = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  // const randomInt = 350786190072;

  return `${clientCode}${timestamp}${randomInt}`; // Format and return RID
}

function generateSubscriberCode() {
  const timestamp = Date.now().toString();

  const uniqueNumber = timestamp.slice(-10);

  // Combine the "CHI" prefix with the unique number
  const subscriberCode = `CHI${uniqueNumber}`;

  return subscriberCode;
}

module.exports = {
  generateTransactionRef,
  generateSubscriberCode,
  generateTransactionRid,
  generateEasyPayTransactionId,
};
