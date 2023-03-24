const express = require("express");
const router = express.Router();

const { getUser, getAllUsers } = require("../controllers/users");

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser);

module.exports = router;
