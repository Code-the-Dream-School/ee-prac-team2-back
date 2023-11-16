// @desc    a test endpoint for fetching some data
// @route   GET /api/v1/
// @access  public
const testsController = (req, res) => {
  return res.json({
    data: "This is a full stack app!",
  });
};

module.exports = { testsController };
