const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");

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
        message: "Please provide a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide a password!"],
      minlength: [8, "password must be at least 8 characters long!"],
      select: false,
    },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],

    // maybe not for the MVP
    // role: {
    //   type: String,
    //   enum: {
    //     values: ["user", "admin"],
    //     message: "Invalid role!",
    //   },
    //   required: [true, "please provide a valid role!"],
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (inputtedPassword) {
  return await bcrypt.compare(inputtedPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
