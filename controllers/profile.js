const Profile = require("../model/Profile");
const Admins = require("../model/Admin");

const createProfile = async (req, res) => {
  const userEmail = req.user.email;
  const enteredEmail = req.body.email;

  if (userEmail != enteredEmail) {
    return res.status(400).json({ msg: "Please enter your registered email" });
  }

  req.body.profileOf = req.user.userId;
  req.body.name = req.user.name;
  req.body.email = req.user.email;
  const checkProfile = req.body.profileOf;
  const profileExists = await Profile.find({ profileOf: checkProfile });
  if (profileExists == null || profileExists.length == "0") {
    const profile = await Profile.create(req.body);
    return res.status(200).json({ profile });
  } else {
    return res.status(400).json("Your Profile already Exists");
  }
};

//admins can access all profiles
const getAllProfiles = async (req, res) => {
  const ID = req.user.userId;
  const userFound = await Admins.findOne({ userID: ID });
  console.log(userFound);
  if (!userFound) {
    return res.status(404).json({ msg: `You are not an admin` });
  } else {
    const profiles = await Profile.find({});
    return res.status(200).json({ profiles });
  }
};

//we dont know the profile id yet
//so we use userId to get the profile
const getProfile = async (req, res) => {
  //this userId is an alias of the id which is taken from parameter
  const requestor = req.user.email;

  const userProfile = await Profile.findOne({
    email: requestor,
  });
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

  const userProfile = await Profile.findOne({
    email: profileToDelete,
  });

  if (!userProfile) {
    return res.status(404).json("Profile Not Available");
  }

  const ID = req.user.userId;
  const userFound = await Admins.findOne({ userID: ID });
  console.log(userFound);
  if (!userFound) {
    return res.status(404).json({ msg: `You are not an admin` });
  } else {
    await Profile.findOneAndDelete({ email: profileToDelete });
    return res.status(200).json("Removed Profile Successfully");
  }
};

const updateProfile = async (req, res) => {
  //we can only update name team and department
  const requestor = req.user.email;
  const {
    body: { name, team, department },
  } = req;

  if (name === "" || team === "" || department == "") {
    res.status(403).json({
      msg: "Please be sure to fill all the available fields to update",
    });
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { email: requestor },
    req.body,
    { new: true, runValidators: true }
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
