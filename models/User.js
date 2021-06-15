const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {type:String, required:[true, 'Username is required'], unique:true},
  password: {type:String, required:[true, 'Password is required'], select:true},
  name: {type:String, required:[true, 'Name is required']},
  email: {type:String}
},
);

module.exports = User = mongoose.model('user',userSchema);