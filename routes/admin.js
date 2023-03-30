const express = require("express");
const { createAdmin, getAdmins } = require("../controllers/admin");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.use(isAdmin);
router.route("/").get(getAdmins);
router.route("/:id").post(createAdmin);

module.exports = router;
