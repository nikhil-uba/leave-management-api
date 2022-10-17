const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).send("You are not authorized.");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
    next();
  } catch (error) {
    res.status(401).send("Authentication Invalid.");
  }
};

module.exports = auth;
