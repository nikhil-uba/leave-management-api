const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getLeaves,
  getUserLeaves,
  getLeave,
  takeLeave,
  getLeavesRemaining,
  getLeavesTaken,
  updateLeave,
  deleteLeave,
  deleteLeaves,
} = require("../controllers/leave");
const isAdmin = require("../middleware/isAdmin");

const leaveStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/leave/attachments");
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

const leaveUpload = multer({ storage: leaveStorage, fileFilter: fileFilter });

router.route("/").get(isAdmin, getLeaves);
router.route("/user").get(getUserLeaves);
router.route("/:id").get(getLeave);
router.route("/remaining").get(getLeavesRemaining);
router.route("/taken").get(getLeavesTaken);
router.route("/takealeave").post(leaveUpload.array("files", 10), takeLeave);
router.route("/update/:id").patch(leaveUpload.array("files", 10), updateLeave);
router.route("/delete/:id").delete(deleteLeave);
router.route("/delete").delete(isAdmin, deleteLeaves);

module.exports = router;
