const authenticateUser = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ msg: "Unauthorized access!" });
  }
  next();
};

module.exports = {
  authenticateUser,
};
