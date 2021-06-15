const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

// Index
// @route GET /users
router.get('/', async (req, res) => {
  await User.find({}).sort({username:1}).exec((err, users) => {
    res.render('users/index', { users : users });
  });
});

// new 
// @route GET /users/new
router.get('/new',async (req, res)=>{
  await res.render('users/new');
});


// create
// @route POST /users
router.post('/', async(req, res)=>{
  const { username, name, email, password, passwordConfirmation } = req.body;
  try {
  // validation
  // 1. 필수 정보를 모두 입력했는지?
  if(!username || !name || !email || !password || !passwordConfirmation){
    const msg = "필수항목은 모두 입력해주세요.";
    return res.send(`<script>alert("${msg}");history.back();</script>`);}
   
  // 2. 비밀번호의 길이가 5자 이상인지?
  if(password.length < 5){
    const msg = "비밀번호는 최소 5자 이상입니다.";
    return res.send(`<script>alert("${msg}");history.back();</script>`);
  }
    
  // 3. 비밀번호를 2번 입력했을때 그 값이 모두 같은지?
  if (password !== passwordConfirmation){
    const msg = "Enter the same password twice for verifictaion";
    return res.send(`<script>alert("${msg}");history.back();</script>`);
  }

  // 4. email주소 중복 확인
  let user = await User.findOne({ email });
  if(user){
    const msg = "이미 존재 하는 메일주소 입니다.";
    return res.send(`<script>alert("${msg}");history.back();</script>`);
  } 
  
  // 비밀번호 암호화
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
      username,
      name,
      email,
      password : passwordHash,
  });
  
  // const saveUser = await newUser.save();
    await newUser.save();
    res.redirect("/users");
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// show
// @route GET /users/:username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({username:req.params.username},{});
    res.render('users/show', { user : user});
  } catch(err) {
    console.error(err);
  }
});


module.exports = router;