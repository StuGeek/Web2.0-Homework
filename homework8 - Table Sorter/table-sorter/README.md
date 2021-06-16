可排列网页的具体代码，利用minify工具压缩成的一行代码：
var mySorter={sortSituaton:1};function compare(a,b,e){return 1==e?a<b:a>b}var Sort=function(body,index){for(var t=document.createElement("tbody"),i=1;i<body.length;i++)for(var j=i+1;j<body.length;j++)if(compare($(body[j].cells[index]).text(),$(body[i].cells[index]).text(),mySorter.sortSituaton)){var temp=body[i];body[i]=body[j],body[j]=temp}return mySorter.sortSituaton=(mySorter.sortSituaton+1)%2,$(body).appendTo(t),t},sortTable=function(header,table){var t=$(header).parent()[0].cells;for(var i in t)if(t[i]==header)var index=i;var body=$.extend(!0,[],table.querySelectorAll("tbody tr"));table.replaceChild(Sort(body,index),table.firstChild)};$(document).ready((function(){$("table").find("td").click((function(){sortTable(this,$($($(this).parent()[0]).parent()[0]).parent()[0])}))}));

点击网页中的表格(非黑色部分)，可以自动排序，可以排序的网站有：

1、https://www.runoob.com/jsref/obj-window.html

2、https://www.runoob.com/jsref/obj-navigator.html

3、https://www.runoob.com/jsref/obj-screen.html

4、https://www.runoob.com/jsref/obj-history.html

5、https://www.runoob.com/jsref/obj-location.html