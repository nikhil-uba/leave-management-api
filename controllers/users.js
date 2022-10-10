const User = require('../model/User')
const Admin = require('../model/Admin')

const getUser = async(req,res)=>{

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

    const ID = req.user.userId;
    const userFound = await Admin.findOne({userID : ID})
    console.log(userFound);
    if(!userFound){
        return res.status(404).json({msg:`You are not an admin`})
    }
    const users = await User.find({})
    return res.status(200).json({users})
}






module.exports = {getUser}

//create CRUD for an admin and user