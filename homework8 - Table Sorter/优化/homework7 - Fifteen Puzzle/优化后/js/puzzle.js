/**
 * 18322081杨宗恺
 * 迷宫游戏的JavaScript文件puzzle.js
 * 正常移动：点击空白旁边的图块，图块移到空白处。点击其它图块，不会移动。
 * 图块图片正常：无论如何移动，每个图块上的图片都保持不变。
 * 拼图结束：当拼回原图时，提示用户游戏获胜。
 * 重新开始：点击重新开始，打乱、重新洗牌。
 * 测试复原后是否显示成功不能直接在网页上改类名，要把点击图块判断是否相邻的判断条件删掉，这样任意空白块和任意图块都可以进行交换这样来测试
 */

 //封装游戏数据
var myPuzzle = {
    //用来表示初始状态的图片块在随机打乱之后处在拼图的哪个位置，数字表示初始状态图片块的下标
    puzzleIndex : [1, 2, 3, 4,
                   5, 6, 7, 8,
                   9, 10, 11, 12,
                   13, 14, 15, 16],
    //生成随机数组时避免重复的数字
    is_used_random_num : [0, 0, 0, 0,
                          0, 0, 0, 0,
                          0, 0, 0, 0,
                          0, 0, 0, 0],
    isStart : 0,
}

/*
* 能还原的充分必要条件是始态和终态的（排列逆序数+空白格的纵坐标+空白格的横坐标）的奇偶性相同。
* 目标状态 1 2 3 4; 5 6 7 8; 9 10 11 12; 13 14 15 16 判别值为偶数
* 所以起始状态的判别值也应该是偶数
*/
var isParityValueEven = (function(){
    var t = 0;
    for (var i in myPuzzle.puzzleIndex){
        for (var j = i + 1; j < 16; ++j){
            if (myPuzzle.puzzleIndex[i] > myPuzzle.puzzleIndex[j]) t = t + 1;
        }
    }
    if (t % 2 == 0) return true;
    else return false;
});

//将用来判断是否出现重复随机数的数组初始化为0
var initialRandomNumArray = (function(){
    for (var i in myPuzzle.is_used_random_num){
        myPuzzle.is_used_random_num[i] = 0;
    }
})

//生成不重复的随机数
var getNotRepeatedRandomNum = (function(){
    var random_num = _.random(1, 16);
    //如果随机数之前已经生成过了，重新生成随机数
    while (myPuzzle.is_used_random_num[random_num] == 1){
        random_num = _.random(1, 16);
    }
    myPuzzle.is_used_random_num[random_num] = 1;
    return random_num;
})
 
//随机产生图片快
var generateRandomPictureBlock = (function(){
    //点击按钮，游戏开始
    myPuzzle.isStart = 1;
    //提示框出现“You are playing the game!”
    $("#display_window").text("You are playing the game!");
    while(1){
        initialRandomNumArray();
        for (var i = 0; i < 16; ++i){
            //生成不重复的随机数
            var random_num = getNotRepeatedRandomNum();
            myPuzzle.puzzleIndex[random_num] = i + 1;
            //用对应的行、列信息生成图片块
            var col = ((random_num % 4) + 1);
            var row = Math.floor((random_num / 4) + 1);
            $("#background_" + (i + 1)).attr("class", "picture_block" + " col_" + col + " row_" + row);
        }
        //如果起始状态的判别值不是偶数，重新生成图片
        if (isParityValueEven() == true) break;
    }
});

//初始创建图片块
var createPictureBlock = (function(){
    var fragment = document.createDocumentFragment();
    myPuzzle.isStart = 0;
    //创建16个图片块
    for (var i = 0; i < 16; ++i){
        //确定相应的行和列的值
        var col = ((i % 4) + 1);
        var row = Math.floor((i / 4) + 1);
        //将行和列的定位信息以及背景图片的定位信息加给图片块
        $("<div/>").attr("class", "picture_block" + " col_" + col + " row_" + row).attr("id", "background_" + (i + 1)).click(click_picture_block).appendTo(fragment);
    }
    //生成图片块
    $(fragment).appendTo("#game_interface");
});

//判断图片块是否相邻
var isAdjoin = (function(a, b){
    //确定当前点击块和空白块的行列信息
    var a_col = parseInt($(a).attr("class").charAt(18));
    var a_row = parseInt($(a).attr("class").charAt(24));
    var b_col = parseInt($(b).attr("class").charAt(18));
    var b_row = parseInt($(b).attr("class").charAt(24));
    if ((Math.abs(a_col - b_col) == 1 && a_row == b_row) || 
        (Math.abs(a_row - b_row) == 1 && a_col == b_col)){
            return true;
    }
    else return false;
});

//交换行列信息和在迷宫数组下标
var swap = (function(a, b){
    //确定当前点击块和空白块的行列信息
    var a_col = parseInt($(a).attr("class").charAt(18));
    var a_row = parseInt($(a).attr("class").charAt(24));
    var b_col = parseInt($(b).attr("class").charAt(18));
    var b_row = parseInt($(b).attr("class").charAt(24));
    var temp = $(a).attr("class");
    $(a).attr("class", $(b).attr("class"));
    $(b).attr("class", temp);
    var t = myPuzzle.puzzleIndex[(a_row - 1) * 4 + (a_col - 1)];
    myPuzzle.puzzleIndex[(a_row - 1) * 4 + (a_col - 1)] = myPuzzle.puzzleIndex[(b_row - 1) * 4 + (b_col - 1)];
    myPuzzle.puzzleIndex[(b_row - 1) * 4 + (b_col - 1)] = t;
});

//点击图片块后图片块的移动行为
var click_picture_block = (function(){
    //游戏未开始，没有行为
    if (myPuzzle.isStart == 0) $("#display_window").text("Click the button to start!");
    else {
        //定位空白快
        var none_block = $("#background_16");
        //如果相邻则交换位置，否则不移动
        if (isAdjoin(this, none_block)){
            //交换行列信息和在迷宫数组下标便于判断成功
            swap(this, none_block);
            //如果还原成功，则显示赢信息
            if (isSuccess() == true) $("#display_window").text("You Win!");
        }
    }
});

//判断是否还原成功
var isSuccess = (function(){
    for (var i in myPuzzle.puzzleIndex){
        if (myPuzzle.puzzleIndex[i] != i + 1) return false;
    }
    myPuzzle.isStart = 0;
    return true;
});

//页面加载完成后，生成图片块
$(document).ready(function(){
    createPictureBlock();
    $("#restart-game").click(generateRandomPictureBlock);
});