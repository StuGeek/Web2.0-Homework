/**
 * 18322081杨宗恺
 * 检查用户输入格式和信息是否重复的check_signin.js文件
 */
//判断用户名是否为空和符合格式
function checkUsername(username){
    var format = /^[a-zA-Z][a-zA-Z_0-9]{5,17}$/;
    //用户名为空，输入框变红，提示不能为空
	if (!username){
		$("input[name='username']").attr("class", "wrong_format");
        $("#username-tooltips").text("用户名不能为空！");
        return false;
    }
    //用户名格式不对，输入框变红，提示格式不对
	else if (!format.test(username)){
		$("input[name='username']").attr("class", "wrong_format");
		$("#username-tooltips").text("用户名输入格式不对！(6~18位英文字母、数字或下划线，必须以英文字母开头)");
        return false;
    }
    //用户名正确，输入框变回黑色
	else{
		$("input[name='username']").removeAttr("class");
        $("#username-tooltips").text("");
        return true;
	}
}

//判断学号是否为空和符合格式
function checkNumber(number){
	var format = /^[1-9][0-9]{7}$/;
	if (!number){
		$("input[name='number']").attr("class", "wrong_format");
        $("#number-tooltips").text("学号不能为空！");
        return false;
	}
	else if (!format.test(number)){
		$("input[name='number']").attr("class", "wrong_format");
		$("#number-tooltips").text("学号输入格式不对！(8位数字，不能以0开头)");
        return false;
    }
	else{
		$("input[name='number']").removeAttr("class");
        $("#number-tooltips").text("");
        return true;
	}
}

//判断电话是否为空和符合格式
function checkPhone(phone){
	var format = /^[1-9][0-9]{10}$/;
	if (!phone){
		$("input[name='phone']").attr("class", "wrong_format");
        $("#phone-tooltips").text("电话不能为空！");
        return false;
	}
	else if (!format.test(phone)){
		$("input[name='phone']").attr("class", "wrong_format");
		$("#phone-tooltips").text("电话输入格式不对！(电话11位数字，不能以0开头)");
        return false;
    }
	else{
		$("input[name='phone']").removeAttr("class");
        $("#phone-tooltips").text("");
        return true;
	}
}

//判断邮箱是否为空和符合格式
function checkEmail(email){
	var format = /^[a-zA-Z_0-9\-]+@([a-zA-Z_0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/;
	if (!email){
		$("input[name='email']").attr("class", "wrong_format");
        $("#email-tooltips").text("邮箱不能为空！");
        return false;
	}
	else if (!format.test(email)){
		$("input[name='email']").attr("class", "wrong_format");
		$("#email-tooltips").text("邮箱输入格式不对！");
        return false;
    }
	else{
		$("input[name='email']").removeAttr("class");
        $("#email-tooltips").text("");
        return true;
	}
}

//点击重置，输入框变黑色，提示框清空
function resetClick(){
	$("input[type='text']").removeAttr("class");
	$("#username-tooltips").text("");
	$("#number-tooltips").text("");
	$("#phone-tooltips").text("");
	$("#email-tooltips").text("");
}

$(document).ready(function(){
    //光标离开输入框后，就对里面的内容进行格式判断
    $("input[name='username']").blur(function(){
		checkUsername($("input[name='username']").val());
	});
	$("input[name='number']").blur(function(){
		checkNumber($("input[name='number']").val());
	});
	$("input[name='phone']").blur(function(){
		checkPhone($("input[name='phone']").val());
	});
	$("input[name='email']").blur(function(){
		checkEmail($("input[name='email']").val());
	});
    $("input[type='reset']").click(resetClick);
    //点击提交按钮，对所有输入框中的内容进行判断
    $("input[type='submit']").click(function() {
        var check = true;
        if (!checkUsername($("input[name='username']").val())) {
            check = false;
        }
        if (!checkNumber($("input[name='number']").val())) {
            check = false;
        }
        if (!checkPhone($("input[name='phone']").val())) {
            check = false;
        }
        if (!checkEmail($("input[name='email']").val())) {
            check = false;
        }
        return check;
    });
    //使用ajax方法进行查重
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //获取用户注册的信息以查重
            var UserData = JSON.parse(xhr.responseText);
            //如果有重复的信息，那么检查有哪些重复信息，并在提示框内给出重复信息
            var repeat_error = UserData.type;
            if (repeat_error) {
                for (var i in repeat_error) {
                    if (repeat_error[i] == "username_type_error") {
                        $("#username-tooltips").text("账号已经存在！");
                    }
                    if (repeat_error[i] == "number_type_error") {
                        $("#number-tooltips").text("学号已经存在！");
                    }
                    if (repeat_error[i] == "phone_type_error") {
                        $("#phone-tooltips").text("电话已经存在！");
                    }
                    if (repeat_error[i] == "email_type_error") {
                        $("#email-tooltips").text("邮箱已经存在！");
                    }
                }
            }
            //将用户上一次输入的信息在输入框内保留，便于修改格式
            $("input[name='username']").val(UserData.userdata.username);
            $("input[name='number']").val(UserData.userdata.number);
            $("input[name='phone']").val(UserData.userdata.phone);
            $("input[name='email']").val(UserData.userdata.email);
        }
    };
    xhr.open("GET", "judge_repeat.json", true);
    xhr.send();
});