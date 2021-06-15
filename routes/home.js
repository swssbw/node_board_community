// const express = require('express');
// const router = express.Router();

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/utils");
const User = require("../models/User");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home/welcome");
});

router.get("/login", async (req, res) => {
  await res.render("home/login");
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user) => {
    if (authError) {
      console.log(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect("/login");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/"); // 로그인 성공시 홈으로 이동
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
