/**
 * 18322081杨宗恺
 * 进行界面控制和注册操作的主js文件signin.js
 */
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');

var MINE = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'text/plain'
};

//对html、css、js、json文件通用的读取文件函数
function ReadFile(filename, response) {
    fs.readFile(filename, 'utf-8', function (err, data) {
        if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            console.log("read " + filename + " failed!");
            response.end(err);
        }
        else {
            response.writeHead(200, { 'Content-Type': MINE[path.extname(filename)] });
            console.log("read " + filename + " successfully!");
            response.end(data);
        }
    });
}

//对html文件通用的读取文件后重定向函数
function ReadFile_Redirect(filename, response, username) {
    fs.readFile(filename, 'utf-8', function (err, data) {
        if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            console.log("read " + filename + " failed!");
            response.end(err);
        }
        else {
            response.writeHead(302, {
                'Location': 'http://localhost:8000/?username=' + username
            });
            console.log("read " + filename + " successfully!");
            response.end(data);
        }
    });
}

//对json文件通用的写文件函数
function WriteJsonFile(filename, data) {
    fs.writeFile(filename, data, function (err) {
        if (err) {
            if (!data) console.log("clear " + filename + " failed!");
            else console.log("write " + filename + " failed!");
            throw error;
        }
        else{
            if (!data) console.log("clear " + filename + " successfully!");
            else console.log("write " + filename + " successfully!");
        }
    });
}

//读入用户数据
var UserData = [];
fs.readFile("userData.json", 'utf-8', function (err, data) {
    if (err) {
        console.log("read userData.json failed!");
        throw err;
    }
    else {
        //如果userData.json为空，转化为可以输入的格式
        if (!data) data = '[]';
        UserData = JSON.parse(data);
        console.log("read userData.json successfully!");
    }
});

http.createServer(function (request, response) {
    //获取文件路径名
    var pathname = url.parse(request.url).pathname;
    //将路径名的第一个"/"去掉可以得到文件名
    var filename = pathname.substr(1);
    var urlObj = url.parse(request.url, true).query;
    //repeat_error的userdata用来存储每一个用户注册的信息，type用来存储出现的重复错误类型，如果没有则为空
    var repeat_error = {
        "userdata": {},
        "type": []
    };
    //当路径为/时，
    if (pathname == "/") {
        //清空上次注册为了显示详情暂存的用户信息还有上次注册时发生的重复错误信息
        WriteJsonFile("signup_details_information.json", "");
        WriteJsonFile("judge_repeat.json", "");
        //如果不是查询信息，那么直接返回注册界面(用户名为abc时不符合格式要求，所以已在保存用户信息的userData.json文件中创建了用户名为abc的用户信息)
        if (!urlObj) {
            ReadFile("signup.html", response);
        }
        //否则进行查询，如果用户存在则返回用户详情界面，否则返回登录界面
        else {
            var find_username = urlObj.username;
            for (var i in UserData) {
                if (UserData[i].username == find_username) {
                    WriteJsonFile("signup_details_information.json", JSON.stringify(UserData[i]));
                    ReadFile("details.html", response);
                    return;
                }
            }
            ReadFile("signup.html", response);
        }
    }
    else if (pathname == "/signup") {
        var post = "";
        request.on("data", function (chunk) {
            post += chunk;
            var postdata = querystring.parse(post);
            //将用户信息保存，以检查重复错误并进行处理
            repeat_error.userdata = postdata;
            var check_username = postdata["username"];
            var check_number = postdata["number"];
            var check_phone = postdata["phone"];
            var check_email = postdata["email"];
            for (var i in UserData) {
                if (UserData[i].username == check_username || UserData[i].number == check_number ||
                    UserData[i].phone == check_phone || UserData[i].email == check_email) {
                    if (UserData[i].username == check_username) {
                        repeat_error.type.push("username_type_error");
                    }
                    if (UserData[i].number == check_number) {
                        repeat_error.type.push("number_type_error");
                    }
                    if (UserData[i].phone == check_phone) {
                        repeat_error.type.push("phone_type_error");
                    }
                    if (UserData[i].email == check_email) {
                        repeat_error.type.push("email_type_error");
                    }
                    //存在重复信息，将错误信息写入judge_repeat.json，并返回注册界面
                    WriteJsonFile("judge_repeat.json", JSON.stringify(repeat_error));
                    ReadFile("signup.html", response);
                    return;
                }
            }
            //不存在重复信息，则将用户注册信息写入userData.json，并写入signin_details_information.json返回详情页面进行显示
            UserData.push(postdata);
            WriteJsonFile("userData.json", JSON.stringify(UserData));
            WriteJsonFile("signup_details_information.json", JSON.stringify(postdata));
            ReadFile_Redirect("details.html", response, postdata["username"]);
        });
    }
    //对于除了favicon.ico外其它所需要获取的html，css，js等文件，直接进行读取
    else if (pathname != "/favicon.ico") {
        ReadFile(filename, response);
    }
}).listen(8000);

console.log("The server is listening on:http://localhost:8000/");