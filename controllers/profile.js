const Profile = require("../model/profile");
const Admins = require("../model/Admin")

const createProfile = async (req, res) => {


  const userEmail = req.user.email
  const enteredEmail = req.body.email


  if(userEmail != enteredEmail){
    return res.status(400).json({msg:'Please enter your registered email'});
  }


  req.body.profileOf = req.user.userId;
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
    const userFound = await Admins.findOne({userID : ID})
    console.log(userFound);
    if(!userFound){
        return res.status(404).json({msg:`You are not an admin`})
    }
    else{
      const profiles = await Profile.find({});
      return res.status(200).json({ profiles });
    }


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
    params: { id: profileId },
  } = req;

  const userProfile = await Profile.findOne({
    _id: profileId,
  });


  if (!userProfile) {
    res.status(404).json("Profile Not Available");
  }

  const ID = req.user.userId;
    const userFound = await Admins.findOne({userID : ID})
    console.log(userFound);
    if(!userFound){
        return res.status(404).json({msg:`You are not an admin`})
    }
    else{
      await Profile.findOneAndDelete({ _id: profileId });
      return res.status(200).json("Removed Profile Successfully");
    }
};


module.exports = { getAllProfiles, getProfile, createProfile, deleteProfile };
