const User = require('../model/User')
const Admin = require('../model/Admin')

const createAdmin = async (req, res) => {

    const ID = req.user.userId;
    const userFound = await Admin.findOne({userID : ID})
    console.log(userFound);
    if(!userFound){
        return res.status(404).json({msg:`You are not an admin`})
    }

    const adminUserId = req.body.userID;

    const userExists = await User.find({ _id : adminUserId });

    if(!userExists){
        return res.status(400).json("The user doesn't exist");
    }

    const adminExists = await Admin.find({userID : adminUserId })

    if (adminExists == null || adminExists.length == "0") {
      const admin = await Admin.create(req.body);
      return res.status(200).json({ msg :`Admin created successfully. Details: ${admin}` });
    } else {
      return res.status(400).json("Your Profile already Exists");
    }
  }


const getAdmins = async(req,res) =>{

    const ID = req.user.userId;
    const userFound = await Admin.findOne({userID : ID})
    console.log(userFound);
    if(!userFound){
        return res.status(404).json({msg:`You are not an admin`})
    }

    const admins = await Admin.find({})
    return res.status(200).json({admins})
}

module.exports = {createAdmin,getAdmins}
