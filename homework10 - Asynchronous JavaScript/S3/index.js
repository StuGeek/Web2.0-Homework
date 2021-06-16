/**
 * 18322081杨宗恺，S3的js文件index.js
 * S3：仿真机器人，并行（五指金龙）
 * 同S2一样，设计一段机器人程序，点击@+按钮，将模拟同时按下A~E按钮，并在所有随机数到达后，立即按下大气泡的过程。
 *     1.根据S1的规则，初始时，A~E 5个按钮都是可以按下的
 *     2.这时，机器人5指齐按，同时向server发出请求
 *     3.机器人观察到所有数据到达后，再按下大气泡
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

function click_control_ring(i) {
    //如果按钮可以被点击
    if (AsyncCal.isActive[i]) {
        return new Promise(function (resolve, reject) {
            //显示这个按钮的红色小圆圈，此时为...状态
            var control_ring_button = $(".unread").eq(i);
            control_ring_button.show();
            //将按钮置为不可被点击
            AsyncCal.isActive[i] = 0;
            //当机器人按下按钮之后，将等待按钮的随机数显示，其余按钮激活
            for (var j in AsyncCal.isActive) {
                if (AsyncCal.isActive[j]) {
                    if (AsyncCal.isActive[j] == 1) {
                        $(".unread").eq(j).parent().css("pointer-events", "all").css("background-color", "#383F9F");
                    }
                }
            }
            //在获取随机数前全部按钮都被按下
            control_ring_button.parent().css("pointer-events", "none").css("background-color", "#7E7E7E");
            return new Promise(function (resolve, reject) {
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
                        //获得随机数的按钮个数加一
                        AsyncCal.numOfGetnum++;
                        //当获得全部按钮获取随机数后，大气泡变蓝
                        if (AsyncCal.numOfGetnum == 5) {
                            $("#info-bar").css("background-color", "#383F9F");
                        }
                        resolve("success");
                    }
                };
                //避免得到缓存结果，向url添加一个唯一的ID
                xmlhttp.open("GET", "/?name=" + Math.random(), true);
                xmlhttp.send();
            }).then(function () { resolve("success"); });
        });
    }
}

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
    //利用all方法当全部异步获取随机数后，再显示之和
    $("#button").click(function () {
        Promise.all([
            click_control_ring(0),
            click_control_ring(1),
            click_control_ring(2),
            click_control_ring(3),
            click_control_ring(4)
        ]).then(function(value){
            showTheSum();
        })
    });
});