//与数据库进行交互的user.js文件
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var validator = require('../public/javascripts/validator');

module.exports = function(db) {
  var users = db.collection('users');
  return {
    //查询用户
    findUser: function(username, password) {
      return users.findOne({username:username}).then(function(user) {
        //用户存在
        if (user) { 
          //比对密码进行校检登录
          return bcrypt.compareSync(password, user.password) ? Promise.resolve(user) 
            : Promise.reject('wrong username or password');
        }
        //否则返回其不存在
        else {
          return Promise.reject("user doesn't exist");
        }
      });
    },

    //创建用户
    createUser: function(user){
      return bcrypt.hashSync(user.password, 10).then(function(hash){
          user.password = hash;
          return users.insert(user);
        });
    },

    //校检用户
    checkUser: function(user) {
        //检验格式
        var formatErrors = validator.findFormatErrors(user);
        return new Promise(function(resolve, reject) {
            formatErrors ? reject(formatErrors) : resolve(user);
        }).then(function(user) {
          //格式正确，检验是否有重复信息
          return users.findOne(getQueryForUniqueInAttribute(user)).then(function(userinformation){
              if (userinformation){
                return Promise.reject("有重复信息")
              }
              else{
                Promise.resolve(user).then(function() {
                  user.password = user.repeatpassword = bcrypt.hashSync(user.password, 10);
                  return users.insert(user);
              });
              }
          });
        });
      }
  };
}

//获取用户除密码和重复密码以外的其他信息
function getQueryForUniqueInAttribute(user) {
  var obj = [];
  for(var key in user){
      var pair = {};
      if(key !== 'password'&& key !== 'repeatpassword'){
          pair[key] = user[key];
          obj.push(pair);
      }
  }
  return{
      $or: obj
  }
}