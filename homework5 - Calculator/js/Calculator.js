/**
 * 18322081杨宗恺，此文件为计算器的Calculator。js文件，
 * 实现计算器的计算功能
 */

 //对于数字、括号、运算符、小数点，点击一次，则结果框内的最后添加一个这个点击的字符
function inputElement(e){
    document.getElementById("result").value += e.innerHTML;
}

//按下退格按钮，则结果框内最后一个字符被清空
function back(){
    var new_length = document.getElementById("result").value.length-1;
    var result = document.getElementById("result").value.substring(0, new_length);
    document.getElementById("result").value = result;
}

//按下CE按钮，则结果框内的内容清空
function clearInformation(){
    document.getElementById("result").value = "";
}

//按下=按钮，如果结果框内的表达式合法，则显示结果，如果表达式不合法，则弹出警告框，提示说明非法
function getTheResult(){
    try{
        var result = document.getElementById("result").value;
        document.getElementById("result").value = eval(result);
    }
    catch{
        alert("算式表达式非法！");
    }
}