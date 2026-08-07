const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'inventory' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};
