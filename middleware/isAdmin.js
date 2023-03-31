const User = require("../model/User");

const isAdmin = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const user = await User.findOne({ _id: id, isAdmin: true });
    if (!user) {
      return res.status(403).json({
        error: "403 Forbidden",
        message: "Admin Privilege Required",
      });
    }
    next();
  } catch (error) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "The requested resource could not be found",
    });
  }
};

module.exports = isAdmin;
