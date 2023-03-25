const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({
      error: "You are not authorized.",
      message: "Authorization Header not set or malformed",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      isAdmin: payload.isAdmin,
      hasProfile: payload.hasProfile,
    };
    if (req.url === "/hastoken") {
      return res.status(200).json({
        user: req.user,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: "Authorization Failed",
      message: "Token malformed or expired",
    });
  }
};

module.exports = auth;
