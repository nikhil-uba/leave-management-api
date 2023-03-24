const User = require("../model/User");

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    console.log("User created");
    res.status(200).json({
      user: { userId: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json("Invalid Credentials");
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json("Invalid Credentials");
    }
    const token = user.createJWT();
    res.status(200).json({
      user: { userId: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = { register, login };
