const User = require("../model/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "400 Bad Request", message: err.message });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "401 Unauthorized", message: "Invalid Credentials" });
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ error: "401 Unauthorized", message: "Invalid Credentials" });
    }
    const token = user.createJWT();
    return res.status(200).json({
      user: { userId: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    if (!(err instanceof Error)) {
      err = new Error(err);
      err.status = 500;
    }

    if (!err.status) {
      err.status = 500;
    }

    return res.status(err.status).json({ error: err.message });
  }
};

module.exports = { login };
