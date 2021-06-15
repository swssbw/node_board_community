const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    failureFlash: true,
  }, async(username, password, done) => {
    try {
      const exUser = await User.findOne({username:username});
      if(exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if(result) {
          done(null, exUser);
        } else {
          done(null, false, {message: '비밀번호 불일치'});
        }
      } else {
        done(null, false, {message: '가입되지 않은 회원'});
      }
    } catch(error) {
      console.error(error);
      done(error);
    }
  }
  ));
}