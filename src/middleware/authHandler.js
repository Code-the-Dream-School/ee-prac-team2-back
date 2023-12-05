const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401);
    throw new Error("Signed in user required!");
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: payload.id });
  if (!user) {
    res.status(401);
    throw new Error("Authentication failed!");
  }
  req.user = { userID: payload.id };
  return next();
};

module.exports = {
  authenticateUser,
};
