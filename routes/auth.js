const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const { register, login } = require("../controllers/auth");
router.get("/hastoken", auth);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
