const User = require("../model/User");

const createAdmin = async (req, res) => {
  const id = req.user.userId;
  const candidateId = req.body.userId;

  const user = await User.findOne({ _id: id, isAdmin: true });
  console.log(
    "admin.js",
    "checking what User.findOne({ _id: id }) yields: ",
    user
  );
  if (!user) {
    return res
      .status(404)
      .json({ error: "Unauthorized Action", message: "You are not an Admin" });
  }

  const candidateUser = await User.findOne({ _id: candidateId });

  if (!candidateUser) {
    return res.status(400).json({
      error: "User not found",
      message: "User Id not registered",
    });
  }

  if (!candidateId.isAdmin) {
    const admin = await User.findByIdAndUpdate(
      candidateId,
      { isAdmin: true },
      { new: true }
    );
    return res.status(200).json({ message: "User role switched to Admin" });
  } else {
    return res
      .status(400)
      .json({ error: "Already an Admin", message: "User is already an Admin" });
  }
};

const getAdmins = async (req, res) => {
  const id = req.user.userId;
  const user = await User.findOne({ _id: id, isAdmin: true });
  if (!user) {
    return res
      .status(404)
      .json({ error: "Unauthorized Action", message: "You are not an Admin" });
  }

  const admins = await User.find({ isAdmin: true }).select("-password");
  return res.status(200).json({ admins });
};

module.exports = { createAdmin, getAdmins };
