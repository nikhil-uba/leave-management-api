const User = require('../model/User')

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(200).json({ user: { name: user.name , _id : user.id}, token })

    
  } catch (error) {
    res.send(error)
  }
}

const login = async (req, res) => {
    const { email, password } = req.body
  
    if (!email || !password) {
      res.send('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
      res.send('Invalid Credentials')
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      res.send('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(200).json({ userdetails: { id: user._id,name: user.name , email:user.email }, token })
  }




  module.exports = {register,login}