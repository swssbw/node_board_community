module.exports = {
  isLoggedIn : (req, res, next) => {
    if(req.isAuthenticated()){
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  },

  isNotLoggedIn : (req, res, next) => {
    if(!req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('이미 로그인 한 상태입니다.');
    }
  }

}