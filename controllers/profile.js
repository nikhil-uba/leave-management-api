const Profile = require('../model/profile')


const createProfile = async(req,res)=>{
    req.body.profileOf = req.user.userId
    const checkProfile = req.body.profileOf

    const profileExists = await Profile.find({profileOf:checkProfile})

    if(profileExists == null || profileExists.length == '0'){
        const profile = await Profile.create(req.body)
        return res.status(200).json({profile})
    }
    else{
        return res.status(400).json('Your Profile already Exists')
    }
}

const getProfile = async(req,res)=>{

    const {params:{id : userId}} = req
    
    const userProfile = await Profile.findOne({
        profileOf: userId
    })
    if(!userProfile){
        return res.status(404).json({msg:"User Not Available"})
    }
    if(userProfile.department === 'HR'){
        const profiles = await Profile.find({})
        return res.status(200).json({profiles})
    }
    else{
        return res.status(200).json({userProfile})
    }
}

const deleteProfile = async(req,res)=>{

    const {params:{id : userId}} = req
    
    const userProfile = await Profile.findOne({
        profileOf: userId
    })
    if(!userProfile){
        return res.status(404).json({msg:"User Not Available"})
    }
    if(userProfile.department === 'HR'){
        await Profile.findOneAndDelete({profileOf:userId})
        return res.status(200).json('Removed Profile Successfully')
    }

    if(!userProfile){
        res.status(404).json("Profile Not Available")
    }

    res.status(401).json('You are not admin')

}

module.exports = {getProfile,createProfile,deleteProfile}