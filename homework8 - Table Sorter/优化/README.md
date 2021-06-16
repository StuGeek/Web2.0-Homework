##优化前后的LoC（代码行数）

###简易计算器
优化前JavaScript文件代码行数为60行，优化后为39行

###迷宫游戏
优化前JavaScript文件代码行数为131行，优化后为119行

###打地鼠游戏
优化前JavaScript文件代码行数为141行，优化后为119行

###拼图游戏
优化前JavaScript文件代码行数为166行，优化后为157行

##工具包toolkits的使用心得
1、因为jquery的特性，进行属性设置的时候，可以用链式编程的方法将一个对象所需设置的属性都写在一起，既节省了代码行数，也避免了不同对象设置属性时行数过多有混乱的情况。

2、在进行随机数生成时，使用原生方法时，如果要生成1~16之间的正数，需要Math.floor((Math.random() * 16) % 16) + 1生成，比较麻烦，需要注意将原本生成随机数的区间[0,1]扩展至[0,15]，最后还要注意加1，而使用lodash方法只需要_.random(1, 16)，十分方便。

3、如果要给一个对象添加事件时，原生方法需要使用addEventListener方法，代码非常地长，而使用jquery方法只需要用$()选中后添加对应的事件即可，比如document.getElementById("restart-game").addEventListener("click", function)，给id为restart-game的类加上click事件，而jquery方法需要$("#restart-game").click(function)，十分简洁。