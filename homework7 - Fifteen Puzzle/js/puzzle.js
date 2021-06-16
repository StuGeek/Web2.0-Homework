/**
 * 18322081杨宗恺
 * 迷宫游戏的JavaScript文件puzzle.js
 * 正常移动：点击空白旁边的图块，图块移到空白处。点击其它图块，不会移动。
 * 图块图片正常：无论如何移动，每个图块上的图片都保持不变。
 * 拼图结束：当拼回原图时，提示用户游戏获胜。
 * 重新开始：点击重新开始，打乱、重新洗牌。
 * 测试复原后是否显示成功不能直接在网页上改类名，要把点击图块判断是否相邻的判断条件删掉，这样任意空白块和任意图块都可以进行交换这样来测试
 */

//用来表示初始状态的图片块在随机打乱之后处在拼图的哪个位置，数字表示初始状态图片块的下标
var puzzleIndex = [1, 2, 3, 4,
                   5, 6, 7, 8,
                   9, 10, 11, 12,
                   13, 14, 15, 16];

//生成随机数组时避免重复的数字
var is_used_random_num = [0, 0, 0, 0,
                          0, 0, 0, 0,
                          0, 0, 0, 0,
                          0, 0, 0, 0];

var isStart = 0;

/*
* 能还原的充分必要条件是始态和终态的（排列逆序数+空白格的纵坐标+空白格的横坐标）的奇偶性相同。
* 目标状态 1 2 3 4; 5 6 7 8; 9 10 11 12; 13 14 15 16 判别值为偶数
* 所以起始状态的判别值也应该是偶数
*/
function isParityValueEven(){
    var t = 0;
    for (var i = 0; i < 16; ++i){
        for (var j = i + 1; j < 16; ++j){
            if (puzzleIndex[i] > puzzleIndex[j]) t = t + 1;
        }
    }
    if (t % 2 == 0) return true;
    else return false;
}
 
//随机产生图片快
function generateRandomPictureBlock(){
    var col = 0;
    var row = 0;
    //点击按钮，游戏开始
    isStart = 1;
    document.getElementById("display_window").innerText = "You are playing the game!";
    while(1){
        //将用来判断是否出现重复随机数的数组初始化为0
        for (var i = 0; i < 16; ++i){
            is_used_random_num[i] = 0;
        }
        for (var i = 0; i < 16; ++i){
            var random_num = Math.floor((Math.random() * 16) % 16);
            //如果随机数之前已经生成过了，重新生成随机数
            while (is_used_random_num[random_num] == 1){
                random_num = Math.floor((Math.random() * 16) % 16);
            }
            is_used_random_num[random_num] = 1;
            puzzleIndex[random_num] = i + 1;
            //用对应的行、列信息生成图片块
            col = ((random_num % 4) + 1);
            row = Math.floor((random_num / 4) + 1);
            document.getElementById("background_" + (i + 1)).className = 
            "picture_block" + " col_" + col + " row_" + row;
        }
        //如果起始状态的判别值不是偶数，重新生成图片
        if (isParityValueEven() == true) break;
    }
}

//初始创建图片块
function createPictureBlock(){
    var fragment = document.createDocumentFragment();
    var col = 0;
    var row = 0;
    isStart = 0;
    //创建16个图片块
    for (var i = 0; i < 16; ++i){
            //创建的图片块为"div"
            var block = document.createElement("div");
            //确定相应的行和列的值
            col = ((i % 4) + 1);
            row = Math.floor((i / 4) + 1);
            //将行和列的定位信息以及背景图片的定位信息加给图片快
            block.className = "picture_block" + " col_" + col + " row_" + row;
            block.id = "background_" + (i + 1);
            block.onclick = click_picture_block;
            fragment.appendChild(block);
    }
    //生成图片块
    document.getElementById("game_interface").appendChild(fragment);
}

//点击图片块后图片块的移动行为
function click_picture_block(){
    //游戏未开始，没有行为
    if (isStart == 0) document.getElementById("display_window").innerText = "Click the button to start!";
    else {
        //定位空白快
        var none_block = document.getElementById("background_16");
        //确定当前点击块和空白块的行列信息
        var col = parseInt(this.className.charAt(18));
        var row = parseInt(this.className.charAt(24));
        var none_block_col = parseInt(none_block.className.charAt(18));
        var none_block_row = parseInt(none_block.className.charAt(24));
        //如果相邻则交换位置，否则不移动
        if ((Math.abs(col - none_block_col) == 1 && row == none_block_row) || 
            (Math.abs(row - none_block_row) == 1 && col == none_block_col)){
            //交换行列信息和在迷宫数组下标便于判断成功
            var temp = this.className;
            this.className = none_block.className;
            none_block.className = temp;
            var t = puzzleIndex[(row - 1) * 4 + (col - 1)];
            puzzleIndex[(row - 1) * 4 + (col - 1)] = puzzleIndex[(none_block_row - 1) * 4 + (none_block_col - 1)];
            puzzleIndex[(none_block_row - 1) * 4 + (none_block_col - 1)] = t;
            //如果还原成功，则显示赢信息
            if (isSuccess() == true) document.getElementById("display_window").innerText = "You Win!";
        }
    }
}

//判断是否还原成功
function isSuccess(){
    for (var i = 0; i < 16; ++i){
        if (puzzleIndex[i] != i + 1) return false;
    }
    isStart = 0;
    return true;
}

//页面加载完成后，生成图片块
window.onload = function() {
    createPictureBlock();
    document.getElementById("restart-game").addEventListener("click", generateRandomPictureBlock);
}