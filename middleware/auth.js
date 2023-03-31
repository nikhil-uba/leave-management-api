const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(400).json({
      error: "400 Bad Request",
      message: "The server could not understand the request",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: payload.userId,
    };
    if (req.url === "/hastoken") {
      res.status(200).json({
        user: req.user,
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      error: "401 Unauthorized",
      message: "Token malformed or expired",
    });
  }
};

module.exports = auth;
