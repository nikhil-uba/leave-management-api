/* const User = require('../model/User')

const isAdmin = async (req,res,next)=>{
  try {
    const ID = req.user.userId;
    const userFound = User.findOne({_id:ID})
    if(!userFound){
        return res.status(404).json({msg:`You are not an admin`})
    }
    next()
  } catch (error) {
    res.status(404).json({msg:`Unknown error`})
    console.log('Unknown Error');
    return
  }
}

module.exports = isAdmin */