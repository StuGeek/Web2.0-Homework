/**
 * 18322081杨宗恺，S1的js文件index.js
 * S1：人工交互
 * 完成从环形菜单，向环形Async求和计算器的转变。计算器交互有以下约束：
 * 1.A~E的按钮：
 *     a.在未得到随机数之前，不显示右上角的红色圆圈
 *     b.用户点击某个按钮，将显示其对应红色圆圈，并发送请求到服务器获取随机数
 *     c.在得到结果前
 *         i.红色圆圈内显示 。。。，表示正在等待随机数
 *         ii.灭活（disable）其它按钮，变为灰色，用户不能够点击（点击没有响应，也不会发送新的请求到服务器）
 *     d.得到服务器发回的随机数后，
 *         i.显示在当前按钮右上角红色圆圈内
 *         ii.灭活当前按钮，变为灰色，用户不能够点击
 *         iii.激活（enable）其余按钮，呈现为蓝色，用户可以点击，从服务器获取随机数
 * 2.大气泡
 *     a.在A~E未能全部得到自己的随机数之前
 *         i.大气泡内无任何显示
 *         ii.灭活大气泡，用户不能够点击
 *     b.当A~E按钮全部获得了自己的随机数时，激活大气泡
 *     c.此时，点击大气泡
 *         i.计算A~E随机数的和，显示在大气泡内
 *         ii.灭活大气泡
 * 3.@+按钮
 *     a.任何时候，鼠标离开@+区域，将重置整个计算器，清除所有A~E按钮的随机数和大气泡内的和
 *     b.鼠标再次指向@+，可以开始新一轮的计算操作
 */

var AsyncCal = {
    //能被点击的按钮个数
    isActive : [1, 1, 1, 1, 1],
    //已经获得随机数的按钮个数
    numOfGetnum : 0
}

//初始化计算器
function initial() {
    //所有按钮为蓝色且可点击
    $(".button").css("pointer-events","all").css("background-color", "#383F9F");
    //红色圆圈内显示...，一开始隐藏
    $(".unread").hide().text("...");
    //大气泡颜色为灰色，且无内容
    $("#info-bar").text("").css("background-color", "#7E7E7E");
    //所有按钮都为可点击
    for (var i in AsyncCal.isActive){
        AsyncCal.isActive[i] = 1;
    }
    //获得随机数的按钮数量为0
    AsyncCal.numOfGetnum = 0;
}

//获取全部随机数后，大气泡内显示相加之和
function showTheSum() {
    if (AsyncCal.numOfGetnum == 5) {
        var sum = 0;
        $(".unread").each(function () {
            sum += parseInt($(this).text());
        });
        $("#info-bar").text(sum).css("background-color", "#7E7E7E");
        //显示完后初始化，不能重复点击
        AsyncCal.numOfGetnum = 0;
    }
}

//点击不同的按钮
function click_control_ring(i) {
    //如果按钮可以被点击
    if (AsyncCal.isActive[i]){
        //显示这个按钮的红色小圆圈，此时为...状态
        var control_ring_button = $(".unread").eq(i);
        control_ring_button.show();
        //将按钮置为不可被点击
        AsyncCal.isActive[i] = 0;
        //其它按钮变灰且设置为点击也不会触发任何事件
        $(".unread").not(control_ring_button).parent().css("pointer-events","none").css("background-color", "#7E7E7E");
        //利用ajax方式向服务器获取随机数
        var xmlhttp;
        //照顾兼容性
        if(window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //响应完成获取随机数后
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //这个按钮的红色小圆圈显示随机数，按钮变灰
                var data = xmlhttp.responseText;
                control_ring_button.text(data);
                control_ring_button.parent().css("pointer-events","none").css("background-color", "#7E7E7E");
                //其它可点击的按钮重新变蓝，且设置为点击可以触发事件
                for (var j in AsyncCal.isActive){
                    if (AsyncCal.isActive[j]){
                        if (AsyncCal.isActive[j] == 1){
                            $(".unread").eq(j).parent().css("pointer-events", "all").css("background-color", "#383F9F");
                        }
                    }
                }
                //获得随机数的按钮个数加一
                AsyncCal.numOfGetnum++;
                //当获得全部按钮获取随机数后，大气泡变蓝
                if (AsyncCal.numOfGetnum == 5){
                    $("#info-bar").css("background-color", "#383F9F");
                } 
            }
        };
        xmlhttp.open("GET", "/", true);
        xmlhttp.send();
    }
};

$(document).ready(function () {
    //一开始先初始化
    initial();
    //点击5个按钮，根据不同的按钮对不同的按钮进行操作
    $(".button").click(function(){
        click_control_ring(parseInt($(this).find("span").attr("id")));
    });
    //鼠标离开@+按钮区域就初始化
    $("#button").mouseleave(initial);
    //点击大气泡，判断后显示相加之和
    $("#info-bar").click(showTheSum);
});