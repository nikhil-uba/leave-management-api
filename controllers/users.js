const User = require("../model/User");
const Admin = require("../model/Admin");
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
  const ID = req.user.userId;
  const userFound = await Admin.findOne({ userID: ID });
  console.log(userFound);
  if (!userFound) {
    return res.status(404).json({ msg: `You are not an admin` });
  }
  const users = await User.find({});
  return res.status(200).json({ users });
};

const getUser = async (req, res) => {
  /* const {params:{id : userId}} = req
    
    const user = await User.findOne({
        _id: userId
    })
    if(!user){
        return res.status(404).json({msg:"User Not Available"})
    }
    if(Admins.includes(user.role)){
        const users = await User.find({})
        return res.status(200).json({users})
    }
    else{
        return res.status(200).json({msg:"You aren't an admin"})
    } */

  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res
    .status(200)
    .json({ userId: user._id, name: user.name, email: user.email });
};

module.exports = { getUser, getAllUsers };

//create CRUD for an admin and user
