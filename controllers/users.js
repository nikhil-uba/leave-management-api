const User = require('../model/User')

const getUser = async(req,res)=>{

    const {params:{id : userId}} = req
    
    const user = await User.findOne({
        _id: userId
    })
    if(!user){
        return res.status(404).json({msg:"User Not Available"})
    }
    if(user.email === 'khanal.ajeeth32@gmail.com'){
        const users = await User.find({})
        return res.status(200).json({users})
    }
    else{
        return res.status(200).json({user})
    }
}
module.exports = {getUser}
