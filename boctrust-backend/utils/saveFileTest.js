const fs = require("fs");
const path = require("path");

const testSaveFile = async (blobInput) => {
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const filename = `${Date.now()}.pdf`;
  const filePath = path.join(uploadDir, filename);

  const arrayBuffer = await blobInput.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error writing PDF:", err);
    } else {
      console.log(`PDF saved at: ${filePath}`);
    }
  });
};

module.exports = testSaveFile;
