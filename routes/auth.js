const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { login } = require("../controllers/auth");
router.get("/hastoken", auth);
router.post("/login", login);

module.exports = router;
