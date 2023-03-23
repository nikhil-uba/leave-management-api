const User = require("../model/User");

const isAdmin = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const user = await User.findOne({ _id: id, isAdmin: true });
    const value = await User.findOne({ _id: id }, "email");
    const value1 = await User.find({}, "email");
    const value2 = await User.findOne({ _id: id }, "-password");
    const value3 = await User.find({}, "-password");
    console.log(
      "check.js",
      "checking what the User.findOne({_id:id}, 'email') yields: ",
      value
    );
    console.log(
      "check.js",
      "checking what the User.find({}, 'email') yields: ",
      value1
    );
    console.log(
      "check.js",
      "checking what the User.findOne({_id: id}, '-password') yields: ",
      value2
    );
    console.log(
      "check.js",
      "checking what the User.find({}, '-password') yields: ",
      value3
    );
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
