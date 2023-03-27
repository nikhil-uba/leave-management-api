const User = require("../model/User");

const createProfile = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const id = req.user.userId;
  let profileImage;

  const file = req.file;
  if (file) {
    profileImage = { filepath: file.path };
  }

  const user = await User.findOne({ _id: id });

  if (!user.hasProfile) {
    const profile = await User.findOneAndUpdate(
      { _id: id },
      { ...data, hasProfile: true, profileImage },
      { new: true, select: "-password" }
    );
    return res.status(200).json({ profile });
  } else {
    return res.status(400).json("Your Profile already Exists");
  }
};

//admins can access all profiles
const getAllProfiles = async (req, res) => {
  const id = req.user.userId;
  const userFound = await User.findOne({ _id: id });
  if (!userFound) {
    return res.status(404).json({ msg: `You are not an admin` });
  } else {
    const profiles = await User.find().select("-password");
    return res.status(200).json({ profiles });
  }
};

//we dont know the profile id yet
//so we use userId to get the profile
const getProfile = async (req, res) => {
  //this userId is an alias of the id which is taken from parameter
  const requestor = req.user.email;

  const userProfile = await User.findOne({
    email: requestor,
  }).select("-password");
  if (!userProfile) {
    return res.status(404).json({ msg: "User Not Available" });
  } else {
    return res.status(200).json({ userProfile });
  }
};

//we need profile id of a profile to delete that profile
//we take profile from the body(text box)
const deleteProfile = async (req, res) => {
  //this userId gives the id of the individual that is logged in

  const profileToDelete = req.body.email;

  const userProfile = await User.findOne({
    email: profileToDelete,
  });

  if (!userProfile) {
    return res.status(404).json("Profile Not Available");
  }

  const id = req.user.userId;
  const userFound = await User.findOne({ _id: id, isAdmin: true });
  if (!userFound) {
    return res.status(404).json({ msg: `You are not an admin` });
  } else {
    await User.findOneAndDelete({ email: profileToDelete });
    return res.status(200).json("Removed Profile Successfully");
  }
};

const updateProfile = async (req, res) => {
  //we can only update name team and department
  const requestor = req.user.email;
  const data = JSON.parse(req.body.data);
  let profileImage;

  const file = req.file;
  if (file) {
    profileImage = { filepath: file.path };
  }

  const updatedProfile = await User.findOneAndUpdate(
    { email: requestor },
    { ...data, hasProfile: true, profileImage },
    { new: true, runValidators: true, select: "-password" }
  );

  if (!updatedProfile) {
    return res
      .status(404)
      .json({ msg: `The profile with email ${requestor} does not exist` });
  }

  res.status(200).json({ updatedProfile });
};

module.exports = {
  getAllProfiles,
  getProfile,
  createProfile,
  deleteProfile,
  updateProfile,
};
