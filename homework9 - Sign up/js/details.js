/**
 * 18322081杨宗恺
 * 注册成功或查询成功后，在详情界面显示用户信息的detail.js文件
 */
$(document).ready(function(){
    //使用ajax方式进行展示信息
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var signin_details_information = JSON.parse(xhr.responseText);
            //将signin_details_information.json保存的用户信息显示到信息框
            $("#username").text(signin_details_information.username);
            $("#number").text(signin_details_information.number);
            $("#phone").text(signin_details_information.phone);
            $("#email").text(signin_details_information.email);
        }
    };
    xhr.open("GET", "signup_details_information.json", true);
    xhr.send();
});