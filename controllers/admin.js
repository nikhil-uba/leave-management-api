const User = require("../model/User");

const createAdmin = async (req, res) => {
  const candidateId = req.params.id;

  const candidateUser = await User.findOne({ _id: candidateId });

  if (!candidateUser) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "The requested resource could not be found",
    });
  }

  if (!candidateId.isAdmin) {
    const admin = await User.findByIdAndUpdate(
      candidateId,
      { isAdmin: true },
      { new: true }
    );
    return res
      .status(201)
      .json({ message: "Admin Privilege has successfully been assigned" });
  } else {
    return res
      .status(200)
      .json({ message: "User already has admin privilege" });
  }
};

const getAdmins = async (req, res) => {
  const id = req.user.userId;

  const admins = await User.find({ isAdmin: true }).select("-password");
  return res.status(200).json({ admins });
};

module.exports = { createAdmin, getAdmins };
