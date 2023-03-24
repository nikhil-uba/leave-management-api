const User = require("../model/User");

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    console.log("User created");
    res
      .status(200)
      .json({
        user: { userId: user._id, username: user.username, email: user.email },
        token,
      });
  } catch (error) {
    res.send(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.send("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.send("Invalid Credentials");
  }
  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.send("Invalid Credentials");
  }
  const token = user.createJWT();
  res.status(200).json({
    user: { userId: user._id, username: user.username, email: user.email },
    token,
  });
};

module.exports = { register, login };
