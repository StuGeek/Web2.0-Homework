/**
 * 18322081杨宗恺，此文件为计算器的Calculator。js文件，
 * 实现计算器的计算功能
 */

 //对于数字、括号、运算符、小数点，点击一次，则结果框内的最后添加一个这个点击的字符
var inputElement = (function(e){
    $("#result").val($("#result").val() + $(e).text());
});

//按下退格按钮，则结果框内最后一个字符被清空
var back = (function(){
    $("#result").val($("#result").val().substr(0, $("#result").val().length - 1));
});

//按下CE按钮，则结果框内的内容清空
var clearInformation = (function(){
    $("#result").val("");
});

//按下=按钮，如果结果框内的表达式合法，则显示结果，如果表达式不合法，则弹出警告框，提示说明非法
var getTheResult = (function(){
    try{
        $("#result").val(eval($("#result").val()));
    }
    catch{
        alert("算式表达式非法！");
    }
});

//点击按钮后按照不同类型有不同反应
$(document).ready(function(){
    $("button").click(function(){
        if ($(this).attr("id") == "back") back();
        else if ($(this).attr("id") == "clear") clearInformation();
        else if ($(this).attr("id") == "equal") getTheResult();
        else inputElement(this);
    });
 });