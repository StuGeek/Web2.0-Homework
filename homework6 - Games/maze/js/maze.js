/**
 * 18322081杨宗恺
 * 迷宫游戏的JavaScript文件maze.js
 * 正常赢：移动鼠标，从开始方块开始，到结束方块结束，中间不碰墙，赢得游戏，显示“You Win”
 * 碰墙输：从开始方块开始后，到结束方块结束之前，碰墙，墙变红，输，显示“You Lose”
 * 重置结果：离开迷宫，墙恢复正常；从开始方块开始时，隐藏结果显示
 * 发现作弊：如果用户未经过开始方块，就指到结束方块，又或者指向S之后，从迷宫外绕路指向结束方块，显示"Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!"
 */

//将全局变量封装起来
var myMaze = {
    //判断鼠标是否在迷宫内部的路上
    isOnRoad: 0,
    //判断游戏是否开始
    isStart: 0,
}

//初始化游戏
function initialGame(){
    document.getElementById("top_wall").className = "wall";
    document.getElementById("left_wall").className = "wall";
    document.getElementById("right_wall").className = "wall";
    document.getElementById("center_wall").className = "wall";
    document.getElementById("bottom_wall").className = "wall";
    myMaze.isOnRoad = 0;
    myMaze.isStart = 0;
}

//鼠标移到开始方块上的函数
function onStart(){
    //提示输赢信息的提示框被隐藏
    document.getElementById("display_window").className = "hideTheInformation";
    //一开始先设置鼠标不在迷宫内部的路上，如果鼠标移开迷宫，那么从外部到达结束方块能显示作弊
    myMaze.isOnRoad = 0;
    //迷宫游戏开始
    myMaze.isStart = 1;
}

//鼠标移到迷宫内部路上的函数
function onRoad(){
    myMaze.isOnRoad = 1;
}

//游戏开始后，鼠标移到上面的墙
function hitTheTopWall(){
    //只有游戏开始才会执行相应的函数，游戏未开始鼠标碰墙但墙不会变红
    if (myMaze.isStart == 1){
        //相应的墙变红
        document.getElementById("top_wall").className = "hitWall";
        document.getElementById("left_wall").className = "hitWall";
        document.getElementById("right_wall").className = "hitWall";
        //提示游戏输了
        document.getElementById("display_window").innerText = "You Lose!";
        //显示输的信息
        document.getElementById("display_window").className += " showTheInformation";
    }
}

//游戏开始后，鼠标移到中间的墙
function hitTheCenterWall(){
    if (myMaze.isStart == 1){
        document.getElementById("center_wall").className = "hitWall";
        document.getElementById("display_window").innerText = "You Lose!";
        document.getElementById("display_window").className += " showTheInformation";
    }
}

//游戏开始后，鼠标移到底部的墙
function hitTheBottomWall(){
    if (myMaze.isStart == 1){
        document.getElementById("bottom_wall").className = "hitWall";
        document.getElementById("display_window").innerText = "You Lose!";
        document.getElementById("display_window").className += " showTheInformation";
    }
}

//鼠标移到结束方块上
function onEnd(){
    //只有游戏开始才会执行相应的函数，游戏未开始鼠标碰到结束标志不会改变显示
    if (myMaze.isStart == 1){
        //鼠标经过迷宫内部的路上到达结束标志，显示游戏赢了
        if (myMaze.isOnRoad == 1){
            document.getElementById("display_window").innerText = "You Win!";
            document.getElementById("display_window").className += " showTheInformation";
        }
        //鼠标不经过迷宫内部的路上到达结束标志，显示游戏作弊
        else{
            document.getElementById("display_window").innerText = "Don't cheat, you should start from the 'S' and move to the 'E' inside the maze!";
            document.getElementById("display_window").className += " showTheInformation";
        }
    }
}

