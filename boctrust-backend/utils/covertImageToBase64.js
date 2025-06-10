const fs = require("fs");
const mime = require("mime-types");

const convertImageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);

  // Get the file extension dynamically
  const mimeType = mime.lookup(filePath); // e.g., 'image/png' or 'image/jpeg'

  if (!mimeType) {
    throw new Error("Unsupported file type");
  }

  // Convert to base64
  const base64String = `data:${mimeType};base64,${imageBuffer.toString(
    "base64"
  )}`;

  return base64String;
};

module.exports = convertImageToBase64;
