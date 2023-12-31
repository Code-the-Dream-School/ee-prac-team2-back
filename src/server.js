require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
const { scheduleJobToSelectActivity } = require("./utils/chosenActivityConfig");

const { PORT = 8000, MONGODB_URI } = process.env;
const app = require("./app");

const listener = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    scheduleJobToSelectActivity();
    app.listen(PORT, console.log(`Listening on Port ${PORT}!`));
  } catch (error) {
    console.log(error);
  }
};

listener();
