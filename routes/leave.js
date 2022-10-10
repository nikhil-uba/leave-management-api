const express = require("express");
const router = express.Router();

const { getEmails} = require('../controllers/leave')

router.route("/:id/leave").post(getEmails)

module.exports = router;