/**
 * 18322081杨宗恺
 * 表格排序的JavaScript文件sorter.js
 * To-Do表格和Staff表格都可以排序，且分别不会影响
 * 一开始两个表格都没排序时，按下表格时，按照升序排序，再按下表格后变成降序，然后升序降序交替排序
 */

//封装排序数据
var mySorter = {
    //排序选择，选1为升序，选0为降序
    sortSituaton : 1,
}

//按下表格时，改变表格的样式和排序选择
var changeSituation = (function(header){
    if (mySorter.sortSituaton == 1) $(header).attr("class", "visited_second");
    else $(header).attr("class", "visited_first");
    var t = $(header).parent()[0];
    //除了被选择的那列表格，其它列的样式恢复原状
    for (var i in t.cells){
        if (t.cells[i] != header) $(t.cells[i]).removeClass();
    }
});

//比较函数，选e为1时为升序，选e为0时为降序
function compare(a, b, e){
    if (e == 1){
        return a < b;
    }
    else return a > b;
}

//排序函数，根据排序选择的状态选择是升序排列还是降序排列
var Sort = (function(body, index){
    var t = document.createElement("tbody");
    for(var i = 0 ; i < body.length; i++){
        for(var j = i + 1; j < body.length; j++){
            if (compare($(body[j].cells[index]).text(), $(body[i].cells[index]).text(), mySorter.sortSituaton)){
                var temp = body[i];
                body[i] = body[j];
                body[j] = temp;
            }
        }
    }
    //一次排序后，改变排序选择状态，下一次选择相反顺序排列
    mySorter.sortSituaton = (mySorter.sortSituaton + 1) % 2;
    $(body).appendTo(t);
    return t;
});

//让一个表格变的可以排序
var sortTable = (function(header, table){
    var t = $(header).parent()[0].cells;
    for (var i in t){
        //选中要排序的那列的下标
        if (t[i] == header) var index = i;
    }
    //将选中的那列进行排序得到的新序列替换原来的序列
    var body = $.extend(true, [], table.querySelectorAll("tbody tr"));
    table.replaceChild(Sort(body, index), table.firstChild);
    //改变选中的那列的表格的样式
    changeSituation(header);
});

$(document).ready(function(){
    //将页面内的所有表格变的可以排序
    $("table").find("th").click(function(){
        //前一个变量为表头，后一个变量为表头所在的表格
        sortTable(this, $($($(this).parent()[0]).parent()[0]).parent()[0]);
    });
});