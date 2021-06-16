//处理不同的url值
var express = require('express');
var router = express.Router();
var url = require('url');
var querystring = require('querystring');
var validator = require('../public/javascripts/validator');

module.exports = function(db) {
	//使用user.js中的方法与数据库进行交互
	var userManager = require('../modules/user')(db);

	//用户直接在界面输入url查询用户
	router.get('/', function(req, res, next) {
		var urlObj = url.parse(req.url).query;
		//获取url中的username
		var url_username = querystring.parse(urlObj).username;
		//如果有用户处于登录状态
		if (req.session.user){
			//获取这个用户的username
			var session_username = req.session.user.username;
			//如果两个username一样，直接重定向至详情界面
			if (url_username == session_username || !url_username){
				res.redirect('/detail');
			}
			//否则跳转到处于登录状态的用户的详情界面，并显示只能访问自己的数据
			else{
				res.render('detail', { title: '详情', user: req.session.user, error: '只能够访问自己的数据'});
			}
		}
		//没有处于登录状态的用户那么直接跳转到登录界面
		else {
			res.redirect('/signin');
		}
	});

	//注册界面显示signup.jade
	router.get('/regist', function(req, res, next) {
		res.render('signup', { title: '注册', user: {} });
	});

	//在注册提交表单后进行校检
	router.post('/regist', function(req, res, next) {
		var user = req.body;
		userManager.checkUser(user).then(function() {
			//如果注册成功，那么将处于登录状态的用户设置为注册用户
			req.session.user = user;
			//浏览器退出后，再度打开浏览器，依然保持已登录状态
			req.session.cookie.maxAge = 100000;
			//重定向至该用户的详情界面
			res.render('detail', { title: '详情', user: user});
			/*res.redirect('/detail');*/
			//注册失败，返回失败原因，跳转到注册界面
		}).catch(function(error) {
			res.render('signup', { title: '注册', user: user, error: error});
		})
	});

	//登录界面
	router.get('/signin', function(req, res, next) {
		//如果有用户处于登录状态，跳转到改用户的详情界面
		if (req.session.user) {
			res.redirect('/detail');
		}
		//否则显示登录界面
		else {
			res.render('signin', { title: '登录' , user:{}});
		}
	});

	//在登录界面提交表单
	router.post('/signin', function(req, res, next) {
		var user = req.body;
		//利用user.js中的方法在数据库中查询用户
		userManager.findUser(user.username, user.password)
		.then(function(user) {
			//如果查询成功，那么将处于登录状态的用户设置为登录用户
			req.session.user = user;
			//浏览器退出后，再度打开浏览器，依然保持已登录状态
			req.session.cookie.maxAge = 100000;
			//重定向至该用户的详情界面
			res.redirect('/detail');
		}).catch(function(error) {
			//登录失败，显示错误的用户名或者密码，跳转到登录界面
			res.render('signin', { title: '登录',error: '错误的用户名或者密码'});
		});
	});

	//默认界面为登录界面
	router.all('*', function(req, res, next){
		req.session.user ? next() : res.redirect('/signin');
	})

	//在登录界面点击退出
	router.get('/signout', function(req, res, next) {
		//删掉登录状态
		delete req.session.user;
		//重定向至登录界面
		res.redirect('/signin');
	});
	
	//详情界面
	router.get('/detail', function(req, res, next) {
		//如果有用户处于登录状态，显示该用户的详情界面
		if (req.session.user) {
			res.render('detail', { title: '详情', user: req.session.user});
		}
	});

	return router;
}