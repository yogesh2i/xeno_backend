const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  token = token.split(" ")[1]; //extracting token from Bearer token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) { //if not verified return with 403
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
};

//generating token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { authenticateJWT, generateToken };