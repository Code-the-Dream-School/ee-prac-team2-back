const path = require("node:path");
const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

// imports
const testsRouter = require("./routes/testsRouter");
const activitiesRouter = require("./routes/activitiesRouter");
const eventsRouter = require("./routes/eventsRouter");
const authRouter = require("./routes/authRouter");
const groupsRouter = require("./routes/groupsRouter");

const { authenticateUser } = require("./middleware/authHandler");

// api documentation: swagger-ui
const swaggerDocument = require("yamljs").load(
  path.join(__dirname, "swagger.yaml")
);
const swaggerUi = require("swagger-ui-express");

const { errorHandler, notFound } = require("./middleware/errorHandler");

// middleware
const { authenticateUser } = require("./middleware/authHandler");

// we shall change the cors origin once the frontend is deployed
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));

// routes

app.get("/", (req, res) => {
  res.send(
    '<h2>Welcome to Data-Night API home page!</h2><a href="/api-docs">Documentation</a>'
  );
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", testsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", authenticateUser, eventsRouter);
app.use("/api/v1/activities", activitiesRouter);
app.use("/api/v1/groups", authenticateUser, groupsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
