//作业9 Signup经过看老师的教学视频重写后复用的signup.js文件，用于检验注册界面的输入格式是否正确和按下注册界面的重置键后将之前的错误信息清除
$(document).ready(function(){
  $('input:not(.button)').blur(function () {
    if(validator.isFieldValid(this.id,$(this).val())){
        $(this).parent().find('.error').text('').hide();
    }else {
        $(this).parent().find('.error').text(validator.form[this.id].errorMessage).show();
    }
  });

  $("input[type='submit']").click(function() {
    $('input:not(.button)').blur();
    if (!validator.isFormValid()) return false;
  });

  $("input[type='reset']").click(function() {
    $('input:not(.button)').attr('value', '');
    $('.error').text('');
  });
});