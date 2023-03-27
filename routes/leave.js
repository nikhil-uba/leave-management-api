const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  takeLeave,
  getRemainingLeaves,
  viewMyLeaveDetails,
  viewEmployeesLeave,
} = require("../controllers/leave");

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

//router.route("/:id/leave").post(takeLeave)
// router.route("/takealeave").post(takeLeave);
router.post("/takealeave", leaveUpload.array("files", 10), takeLeave);

router.route("/myremainingleaves").get(getRemainingLeaves);
router.route("/myleavedetails").get(viewMyLeaveDetails);
router.route("/employeeleavedetails").get(viewEmployeesLeave);

module.exports = router;
