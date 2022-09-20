const Profile = require("../model/profile");
const User = require("../model/User");
const Admins = require("../Admins");

const createProfile = async (req, res) => {
  req.body.profileOf = req.user.userId;
  //const checkProfile = req.body.profileOf;

  //const profileExists = await Profile.find({ profileOf: checkProfile });
  //const userEmail = req.user.email
  //if(userEmail == req.body.email){
    //return res.status(400).json({msg:'Please enter your registered email'});
  //}

  if (profileExists == null || profileExists.length == "0") {
    const profile = await Profile.create(req.body);
    return res.status(200).json({ profile });
  } else {
    return res.status(400).json("Your Profile already Exists");
  }
};

//admins can access all profiles
const getAllProfiles = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const canAccess = await User.findOne({
    _id: userId,
  });

  if (!canAccess) {
    return res.status(404).json({ msg: "You may not be logged in" });
  }
  if (Admins.includes(canAccess.email)) {
    const profiles = await Profile.find({});
    return res.status(200).json({ profiles });
  }

  res
    .status(200)
    .send("Please pass your userID as paramteter to access your profile");
};

//we dont know the profile id yet
//so we use userId to get the profile
const getProfile = async (req, res) => {
  //this userId is an alias of the id which is taken from parameter
  const {
    params: { id: userId },
  } = req;

  const userProfile = await Profile.findOne({
    profileOf: userId,
  });
  if (!userProfile) {
    return res.status(404).json({ msg: "User Not Available" });
  } else {
    return res.status(200).json({ userProfile });
  }
};

//we need profile id of a profile to delete that profile
//we take profile id as parameter
const deleteProfile = async (req, res) => {
  //this userId gives the id of the individual that is logged in
  const {
    user: { userId },
    params: { id: profileId },
  } = req;

  const userProfile = await Profile.findOne({
    _id: profileId,
  });

  const requestedBy = await User.findOne({
    _id: userId,
  });

  if (Admins.includes(requestedBy.email)) {
    await Profile.findOneAndDelete({ _id: profileId });
    return res.status(200).json("Removed Profile Successfully");
  }

  if (!userProfile) {
    res.status(404).json("Profile Not Available");
  }

  res.status(401).json("You are not admin");
};

module.exports = { getAllProfiles, getProfile, createProfile, deleteProfile };
