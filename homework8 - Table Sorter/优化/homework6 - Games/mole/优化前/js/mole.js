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
function showTheInformaion(){
    if (myMole.isPlaying == 1){
        document.getElementById("game_situation").value = "Playing";
    }
    else{
        document.getElementById("game_situation").value = "Game Over";
    }
    document.getElementById("time").value = myMole.timer;
    document.getElementById("score").value = myMole.score;
}

//游戏初始化数据
function initialInformation (){
    myMole.isPlaying = 1;
    myMole.isStop = 0;
    myMole.timer = 31;
    myMole.score = 0;
    myMole.mousePos = 0;
    myMole.molePos = 0;
}

//点击开始/结束按钮，改变游戏状态
function changeGameSituation(){
    //点击开始按钮，游戏被初始化
    if (myMole.isPlaying == 0){
        initialInformation();
        showTheInformaion();
        generateMole();
        Timer();
    }
    //点击结束按钮，游戏结束
    else{
        myMole.isStop = 1;
    }
}

//游戏计时器
function Timer(){
    var int = setTimeout("Timer()", 1000);
    //点击结束游戏，弹出提示框显示游戏结果，游戏结束
    if(myMole.timer == 0 || myMole.isStop == 1){
        clearInterval(int);
        alert("Game Over." + '\n' + "Your score is: " + myMole.score);
        myMole.isPlaying = 0;
        myMole.isStop = 0;
        document.getElementsByClassName("hole")[myMole.molePos].checked = false;
    }
    //游戏未结束时，计时器减一
    else if (myMole.isPlaying == 1){
        myMole.timer--;
    }
    //显示游戏信息
    showTheInformaion();
}

//鼠标移动到上面，将要点击的位置原始的状态
function followMousePos(){
    myMole.mousePos = this.checked;
}

//随机产生地鼠所在的洞
function generateMole(){
    myMole.molePos = Math.floor(Math.random() * 60);
    document.getElementsByClassName("hole")[myMole.molePos].checked = true;
}

//判断是加法还是扣分
function countTheScore(){
    //游戏开始时点击洞才计分，游戏结束后点击洞无反应
    if(myMole.isPlaying == 1){
        //如果点击的洞是产生地鼠的洞，那么计分加一，产生另外的随机地鼠洞
        if (myMole.mousePos == true){
            myMole.score++
            generateMole();
        }
        //否则计分减一，不产生另外的地鼠洞
        else{
            myMole.score--;
        }
    }
    //显示计分结果
    document.getElementById("score").value = myMole.score;
    //将点击的洞的选择状态置为false
    this.checked = false;
}

//创建按钮
function createButton(){
    var fragment = document.createDocumentFragment();
    //创建按钮为6行10列
    for (var i = 0; i < 6; ++i){
        for (var j = 0; j < 10; ++j){
            //创建的按钮为"input"
            var mole = document.createElement("input");
            //类型为"radio"
            mole.setAttribute("type", "radio");
            //类名为"hole"
            mole.className = "hole";
            //当鼠标移动到上面时，记录将要点击的洞的状态
            mole.addEventListener("mousedown", followMousePos);
            //鼠标点击后，开始计分
            mole.addEventListener("click", countTheScore);
            fragment.appendChild(mole);
        }
        //添加换行符
        var lineBreak = document.createElement("br");
        fragment.appendChild(lineBreak);
    }
    //生成按钮
    document.getElementById("game_interface").appendChild(fragment);
}

//页面加载完成后，生成按钮
window.onload = function() {
    createButton();
    document.getElementById("game_button").addEventListener("click", changeGameSituation);
}