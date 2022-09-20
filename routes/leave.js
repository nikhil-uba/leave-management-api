const express = require("express");
const router = express.Router();

const applyForLeave = require('../controllers/leave')

router.route("/:id/leave").post(applyForLeave)

module.exports = router;