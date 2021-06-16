/**
 * 18322081杨宗恺
 * 迷宫游戏的JavaScript文件maze.js
 * 打地鼠：随机出现地鼠，鼠标能够击中（点击正确，地鼠消失，出现新地鼠；点击错误，地鼠不消失）
 * 计分：计算分数并显示，点击结束游戏或时间倒计时为0结束游戏
 */

//封装游戏数据
var myMole = {
    //判断游戏是否正在进行
    isPlaying: 0,
    //判断是否按下结束按钮
    isStop: 0,
    //计时器
    timer: 0,
    //计分
    score: 0,
    //当前鼠标移动和点击到的位置
    mousePos: 0,
    //当前地鼠出现的位置
    molePos: 0,
}

//显示游戏信息，包括游戏状态、时间、计分
var showTheInformaion = (function(){
    if (myMole.isPlaying == 1) $("#game_situation").val("Playing");
    else $("#game_situation").val("Game Over");
    $("#time").val(myMole.timer);
    $("#score").val(myMole.score);
});

//游戏初始化数据
var initialInformation = (function(){
    myMole.isPlaying = 1;
    myMole.isStop = 0;
    myMole.timer = 31;
    myMole.score = 0;
    myMole.mousePos = 0;
    myMole.molePos = 0;
});

//点击开始/结束按钮，改变游戏状态
var changeGameSituation = (function(){
    //点击开始按钮，游戏被初始化
    if (myMole.isPlaying == 0){
        initialInformation();
        showTheInformaion();
        generateMole();
        Timer();
    }
    //点击结束按钮，游戏结束
    else myMole.isStop = 1;
});

//游戏计时器
var Timer = (function(){
    var int = setTimeout("Timer()", 1000);
    //点击结束游戏，弹出提示框显示游戏结果，游戏结束
    if(myMole.timer == 0 || myMole.isStop == 1){
        clearInterval(int);
        alert("Game Over." + '\n' + "Your score is: " + myMole.score);
        myMole.isPlaying = 0;
        myMole.isStop = 0;
        $(".hole").eq(myMole.molePos).prop("checked", false);
    }
    //游戏未结束时，计时器减一
    else if (myMole.isPlaying == 1) myMole.timer--;
    //显示游戏信息
    showTheInformaion();
});

//鼠标移动到上面，将要点击的位置原始的状态
var followMousePos = (function(){
    myMole.mousePos = $(this).prop("checked");
});

//随机产生地鼠所在的洞
var generateMole = (function(){
    myMole.molePos = _.random(0, 59);
    $(".hole").eq(myMole.molePos).prop("checked", true);
});

//判断是加法还是扣分
var countTheScore = (function(){
    //游戏开始时点击洞才计分，游戏结束后点击洞无反应
    if(myMole.isPlaying == 1){
        //如果点击的洞是产生地鼠的洞，那么计分加一，产生另外的随机地鼠洞
        if (myMole.mousePos == true){
            myMole.score++;
            generateMole();
        }
        //否则计分减一，不产生另外的地鼠洞
        else myMole.score--;
    }
    //显示计分结果
    $("#score").val(myMole.score);
    //将点击的洞的选择状态置为false
    $(this).prop("checked", false);
});

//创建按钮
var createButton = (function(){
    var fragment = document.createDocumentFragment();
    //创建按钮为6行10列
    for (var i = 0; i < 6; ++i){
        for (var j = 0; j < 10; ++j){
            $("<input type='radio' class='hole'>").mousedown(followMousePos).click(countTheScore).appendTo(fragment);
        }
        //添加换行符
        $("<br/>").appendTo(fragment);
    }
    //生成按钮
    $(fragment).appendTo("#game_interface");
});

$(document).ready(function(){
    createButton();
    $("#game_button").click(changeGameSituation);
});