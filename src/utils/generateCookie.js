const generateCookie = ({ res, token }) => {
  const oneDay = 24 * 60 * 60 * 1000;
  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.PRODUCTION_ENV === "production",
    sameSite: false
  });
};

module.exports = generateCookie;
