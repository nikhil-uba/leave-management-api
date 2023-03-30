const User = require("../model/User");
const mongoose = require("mongoose");

const createUser = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    return res.status(201).json({
      user: { userId: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "400 Bad Request", message: err.message });
  }
};

const getUser = async (req, res) => {
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
  }).select("-password");
  if (!user) {
    return res
      .status(404)
      .json({ error: "404 Not Found", message: "User not found" });
  }
  return res.status(200).json({
    user,
  });
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ error: "404 Not Found", message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "400 Bad Request", message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User Successfully Deleted" });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "400 Bad Request", message: err.message });
  }
};

const getUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  return res.status(200).json({ users });
};
const deleteUsers = async (req, res) => {
  try {
    await User.deleteMany({ _id: { $in: req.body } });
    return res.status(200).json({ message: "User Successfully Deleted" });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "400 Bad Request", message: err.message });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  deleteUsers,
};
