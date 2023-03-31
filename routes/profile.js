const express = require("express");
const multer = require("multer");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/profile");

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/profile/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
};

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
});

router.route("/").get(getProfile);
router.route("/update").patch(profileUpload.single("file"), updateProfile);

module.exports = router;
