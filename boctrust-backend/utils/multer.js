const multer = require("multer");

// Set up Multer storage to define where to save the uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file with a unique name
  },
});

const upload = multer({
  storage: storage,
});

module.exports = {
  upload,
  storage,
};
