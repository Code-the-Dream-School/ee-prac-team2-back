const User = require("../models/User");

// @desc    Endpoint for fetching all the registered users
// @route   GET /api/v1/users
// @access  public
const getUsers = async (req, res) => {
  const registeredUsers = await User.find({}, "name email");

  res.json({ count: registeredUsers.length, users: registeredUsers });
};

module.exports = { getUsers };
