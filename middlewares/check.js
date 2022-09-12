const profile = require('../model/User')

const isAdmin = async (req,res,next)=>{
    const {params:{id}} = req
    
    const userProfile = await profile.findOne({
        profileOf : id
    })
    if(!userProfile){
        return res.status(404).json({msg:"Profile Not Available"})
    }
    if(userProfile.department == 'HR'){
        next()
        return
    }
    else{
        res.status(401).json('You are not admin.')
    }
}

module.exports = isAdmin