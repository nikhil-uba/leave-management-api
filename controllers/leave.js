const Profile = require("../model/profile");
const User = require("../model/User");
const Admins = require("../Admins");

const applyForLeave = async (req, res) => {
  const appliedBy = req.user.userId ;//req.user.email
 
  if(!appliedBy){
    res.status(400).json({msg:"You aren't logged in"})
  }
  const appliedByUser = await Profile.findOne({
    profileOf: appliedBy,
  });
  if (!appliedByUser) {
    return res.status(404).json({ msg: "You may not be logged in" });
  }
  var appliersTeam = appliedByUser.team;

  const appliersTeammates = await Profile.find({ team: appliersTeam });
  
  teammateIds = []
  appliersTeammates.forEach(teammate =>{
    return teammateIds.push(teammate.profileOf);
  })

  teammateUsers = []

  teammateIds.forEach(async id =>{
    let teammateUserDetails = await User.findOne({_id:id});
    console.log(teammateUserDetails.email);
    if(!(teammateUserDetails.email in teammateUsers)){
    	return teammateUsers.push(teammateUserDetails.email)
    }
  })

  console.log(teammateUsers);
};


module.exports = applyForLeave;
