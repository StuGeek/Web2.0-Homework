//作业9 Signup经过看老师的教学视频重写后复用的validator.js文件，用于判断输入格式是否正确
var validator = {
  form: {
    username: {
      status: false,
      errorMessage: "6~18位英文字母、数字或下划线，必须以英文字母开头"
    },
    password: {
      status: false,
      errorMessage: "密码为6~12位数字、大小写字母、中划线、下划线"
    },
    repeatpassword: {
      status: false,
      errorMessage: "两次输入的密码不一致"
    },
    number: {
      status: false,
      errorMessage: "8位数字，不能以0开头"
    },
    phone: {
      status: false,
      errorMessage: "电话11位数字，不能以0开头"
    },
    email: {
      status: false,
      errorMessage: "邮箱输入格式不对！"
    }
  },

  findFormatErrors: function(user) {
    var errorMessages = [];
        for(var key in user){
            if(!validator.isFieldValid(key,user[key]))
                errorMessages.push(validator.form[key].errorMessage);
        }
        return errorMessages.length > 0 ? new Error(errorMessages.join('<br />')) :null;
  },

  findAttrValueUnique: function(user) {
    var errorMessages = [];
        for(var key in user){
          if (!validator.isAttrValueUnique(users, user, key)) {
            errorMessages.push("key: " + key + " is not unique by value: " + user[key]);
          }
        }
        return errorMessages.length > 0 ? new Error(errorMessages.join('<br />')) :null;
  },

  isUsernameValid: function(username) {
    var format = /^[a-zA-Z][a-zA-Z_0-9]{5,17}$/;
    return this.form.username.status = format.test(username);
  },

  isPasswordValid: function(password) {
    this.password = password;
    var format = /^[a-zA-Z_0-9\-]{6,12}$/;
    return this.form.password.status = format.test(password);
  },

  isRepeatpasswordValid: function(repeatpassword) {
    return this.form.repeatpassword.status = repeatpassword == this.password;
  },

  isNumberValid: function(number) {
    var format = /^[1-9][0-9]{7}$/;
    return this.form.number.status = format.test(number);
  },

  isPhoneValid: function(phone) {
    var format = /^[1-9][0-9]{10}$/;
    return this.form.phone.status = format.test(phone);
  },

  isEmailValid: function(email) {
    var format = /^[a-zA-Z_0-9\-]+@([a-zA-Z_0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/;
    return this.form.email.status = format.test(email);
  },

  isFieldValid: function(fieldname, value) {
    var captureField = capitalize(fieldname);
    return this["is" + captureField + "Valid"](value);
  },

  isFormValid: function() {
    return this.form.username.status && this.form.number.status && this.form.phone.status && this.form.email.status && 
      this.form.password.status && ((typeof window == 'object') || this.form.repeatpassword.status);
  },

  getErrorMessage: function(fieldname) {
    return this.form[fieldname].errorMessage;
  },

  isAttrValueUnique: function (registry,user,attr) {
    for(var key in registry){
        if(registry.hasOwnProperty(key)&&registry[key][attr] === user[attr])
        return false;
    }
    return true;
  }
}

if (typeof module == 'object') {
  module.exports = validator;
}

function capitalize(str){
  return str[0].toUpperCase() + str.slice(1, str.length);
}