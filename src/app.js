const path = require("node:path");
const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// routers
const testsRouter = require("./routes/testsRouter");
const activitiesRouter = require("./routes/activitiesRouter");
const eventsRouter = require("./routes/eventsRouter");
const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/usersRouter");
const groupsRouter = require("./routes/groupsRouter");

// middleware
// api documentation: swagger-ui
const swaggerDocument = require("yamljs").load(
  path.join(__dirname, "swagger.yaml")
);
const swaggerUi = require("swagger-ui-express");

const { errorHandler, notFound } = require("./middleware/errorHandler");
const { authenticateUser } = require("./middleware/authHandler");

// we shall change the cors origin once the frontend is deployed
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 12 },
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      collection: "sessions",
    }),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./utils/passportConfig")(passport);

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
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/groups", authenticateUser, groupsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
