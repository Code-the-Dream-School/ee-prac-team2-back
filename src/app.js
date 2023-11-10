const path = require("node:path");
const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

// imports
const mainRouter = require("./routes/mainRouter");
const activityRouter = require("./routes/activityRouter");

const { errorHandler, notFound } = require("./middleware/errorHandler");

// middleware

// we shall change the cors origin once the frontend is deployed
app.use(cors({ origin: "http://localhost:4000", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));

app.get("/", (req, res) => {
  res.send('<h2>Welcome!</h2><a href="#">Documentation</a>');
});

// routes
app.use("/api/v1", mainRouter);
app.use("/api/v1/activity", activityRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
