const express = require("express");
const router = express.Router();

const {
  deleteProfile,
  getProfile,
  createProfile,
  getAllProfiles,
  updateProfile,
} = require("../controllers/profile");

router.route("/").post(createProfile).get(getAllProfiles);
//router.route("/:id").get(getProfile).delete(deleteProfile);
router.route("/getMyProfile").get(getProfile);
router.route("/deleteProfile").delete(deleteProfile);
router.route("/updateMyProfile").patch(updateProfile);

module.exports = router;
