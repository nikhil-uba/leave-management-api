const User = require("../model/User");

const isAdmin = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const user = await User.findOne({ _id: id, isAdmin: true });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Authorized", message: "You are not an Admin" });
    }
    next();
  } catch (error) {
    res.status(404).json({
      error: error,
      message: "Error Occurred while trying to authorize",
    });
    return;
  }
};

module.exports = isAdmin;
