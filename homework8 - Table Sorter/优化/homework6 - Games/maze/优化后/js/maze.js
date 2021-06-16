/**
 * 18322081杨宗恺
 * 迷宫游戏的JavaScript文件maze.js
 * 正常赢：移动鼠标，从开始方块开始，到结束方块结束，中间不碰墙，赢得游戏，显示“You Win”
 * 碰墙输：从开始方块开始后，到结束方块结束之前，碰墙，墙变红，输，显示“You Lose”
 * 重置结果：离开迷宫，墙恢复正常；从开始方块开始时，隐藏结果显示
 * 发现作弊：如果用户未经过开始方块，就指到结束方块，又或者指向S之后，从迷宫外绕路指向结束方块，显示"Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!"
 */
var myMaze = {
    //判断鼠标是否在迷宫外
    isOutOfMaze : 0,
    //判断游戏是否开始
    isStart : 0,
}

//初始化游戏
var initialGame = (function(){
    $("#top_wall").attr("class", "wall");
    $("#left_wall").attr("class", "wall");
    $("#right_wall").attr("class", "wall");
    $("#center_wall").attr("class", "wall");
    $("#bottom_wall").attr("class", "wall");
    myMaze.isStart = 0;
});

//鼠标移到开始方块上的函数
var onStart = (function(){
    //提示输赢信息的提示框被隐藏
    $("#display_window").attr("class", "hideTheInformation");
    //迷宫游戏开始
    myMaze.isStart = 1;
});

//鼠标在迷宫里，那么变量设置为0
var inMaze = (function(){
    myMaze.isOutOfMaze = 0;
});

//鼠标在迷宫外，那么变量设置为1
var outMaze = (function(){
    myMaze.isOutOfMaze = 1;
});

 //游戏开始后，鼠标移到上面的墙
var hitTheTopWall = (function(){
    //只有游戏开始才会执行相应的函数，游戏未开始鼠标碰墙但墙不会变红
    if (myMaze.isStart == 1){
        //相应的墙变红
        $("#top_wall").attr("class", "hitWall");
        $("#left_wall").attr("class", "hitWall");
        $("#right_wall").attr("class", "hitWall");
        //提示游戏输了,显示输的信息
        $("#display_window").text("You Lose!").attr("class", "showTheInformation");
    }
});

//游戏开始后，鼠标移到中间的墙
var hitTheCenterWall = (function(){
    if (myMaze.isStart == 1){
        $("#center_wall").attr("class", "hitWall");
        $("#display_window").text("You Lose!").attr("class", "showTheInformation");
    }
});

//游戏开始后，鼠标移到底部的墙
var hitTheBottomWall = (function(){
    if (myMaze.isStart == 1){
        $("#bottom_wall").attr("class", "hitWall");
        $("#display_window").text("You Lose!").attr("class", "showTheInformation");
    }
});

//鼠标移到结束方块上
var onEnd = (function(){
    //只有游戏开始才会执行相应的函数，游戏未开始鼠标碰到结束标志不会改变显示
    if (myMaze.isStart == 1){
        //鼠标经过迷宫内部的路上到达结束标志，显示游戏赢了
        if (myMaze.isOutOfMaze == 0){
            $("#display_window").text("You Win!").attr("class", "showTheInformation");
        }
        //鼠标不经过迷宫内部的路上到达结束标志，显示游戏作弊
        else{
            $("#display_window").text("Don't cheat, you should start from the 'S' and move to the 'E' inside the maze!").attr("class", "showTheInformation");
        }
    }
});

//初始化墙
var initialWall = (function(){
    $(".wall").mouseover(function(){
        if ($(this).attr("id") == "top_wall" || $(this).attr("id") == "left_wall" || 
        $(this).attr("id") == "right_wall") hitTheTopWall();
        else if ($(this).attr("id") == "center_wall") hitTheCenterWall();
        else if ($(this).attr("id") == "bottom_wall") hitTheBottomWall();
    });
    $(".wall").mouseleave(initialGame);
});

//初始化迷宫
var initialMaze = (function(){
    $("#maze").mouseover(inMaze).mouseleave(outMaze);
});

//初始化开始块
var initialStart = (function(){
    $("#start").mouseover(onStart);
});

//初始化结束块
var initialEnd = (function(){
    $("#end").mouseover(onEnd).mouseleave(initialGame);
});

$(document).ready(function(){
    initialWall();
    initialMaze();
    initialStart();
    initialEnd();
 });