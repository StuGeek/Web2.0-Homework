//登录界面的signin.js文件，主要用于按下登录界面的重置键后将之前的错误信息清除
$(document).ready(function(){
  $("input[type='reset']").click(function() {
    $('.error').text('');
  });
});