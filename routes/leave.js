const express = require("express");
const router = express.Router();

const {
  takeLeave,
  getRemainingLeaves,
  viewMyLeaveDetails,
  viewEmployeesLeave,
} = require("../controllers/leave");

//router.route("/:id/leave").post(takeLeave)
router.route("/takealeave").post(takeLeave);
router.route("/myremainingleaves").get(getRemainingLeaves);
router.route("/myleavedetails").get(viewMyLeaveDetails);
router.route("/employeeleavedetails").get(viewEmployeesLeave);

module.exports = router;
