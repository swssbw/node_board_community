const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connect = require("./config/db");
const app = express();
const passport = require("passport");
const passportConfig = require("./passport/passport");
const session = require("express-session");

passportConfig();

dotenv.config();
connect();
app.set("port", process.env.PORT || 3001);
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

// --------------------------------------------------
// router
// --------------------------------------------------
app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

app.use((req, res, next) => {
  const error = new Error(`${req.method}${req.url}라우터가 없습니다`);
  error.status(err.status || 404);
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status || 500);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
