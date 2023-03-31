const express = require("express");
const router = express.Router();

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteUsers,
} = require("../controllers/users");
const isAdmin = require("../middleware/isAdmin");

router.use(isAdmin);
router.route("/").get(getUsers);
router.route("/create").post(createUser);
router.route("/:id").get(getUser);
router.route("/update/:id").patch(updateUser);
router.route("/delete/:id").delete(deleteUser);
router.route("/delete").delete(deleteUsers);

module.exports = router;
