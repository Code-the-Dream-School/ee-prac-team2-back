const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a name!"],
    },
    email: {
      type: String,
      required: [true, "please provide an email!"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email!",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide a password!"],
      minlength: [8, "password must be at least 8 characters long!"],
      select: false,
    },
  },
  { timestamps: true }
);

// Middlware function responsible for hashing the password using bcrypt
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// A User model method for creating a jwt token saving user's ID as its payload
userSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

module.exports = mongoose.model("User", userSchema);
