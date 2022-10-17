const express = require("express");
const { createAdmin, getAdmins } = require("../controllers/admin");
const router = express.Router();

router.route("/").post(createAdmin).get(getAdmins);

module.exports = router;
