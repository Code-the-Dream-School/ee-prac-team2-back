const path = require("node:path");
const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

// imports
const testsRouter = require("./routes/testsRouter");

const { errorHandler, notFound } = require("./middleware/errorHandler");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));

// routes
app.use("/api/v1", testsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
