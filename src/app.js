const path = require("node:path");
const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

// imports
const testsRouter = require("./routes/testsRouter");
const activitiesRouter = require("./routes/activitiesRouter");
const votesRouter = require("./routes/votesRouter");

const { errorHandler, notFound } = require("./middleware/errorHandler");

// middleware

// we shall change the cors origin once the frontend is deployed
app.use(cors({ origin: process.env.ORIGIN, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));

// routes
app.use("/api/v1", testsRouter);
app.use("/api/v1/activities", activitiesRouter);
app.use("/api/v1/votes", votesRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
