const express = require("express");
const router = express.Router();

const {
  deleteProfile,
  getProfile,
  createProfile,
  getAllProfiles,
} = require("../controllers/profile");

router.route("/").post(createProfile).get(getAllProfiles);
router.route("/:id").get(getProfile).delete(deleteProfile);

module.exports = router;
