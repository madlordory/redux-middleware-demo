# app-2017-lucky-event
## 构建

#### webpack+cortex+es6+react+less

```sh
cd /path/of/your/project

//手动构建
webpack

//自动构建
webpack --watch
```

## 运行调试

通过`webpack-dev-server`开启本地web server服务器，支持自动构建，支持热部署Hot Module Replacement (HMR)，即每次修改完代码`webpack-dev-server`会自动build并让浏览器自动载入被修改过的模块，开发者无需手动刷新浏览器。


#### webpack+cortex+es6+react+less

```sh
npm start
```
项目初始化完毕后会自动运行上面的命令开启调试模式

## 发布
不用本地构建，直接发布
1.  git commit and push

2.  CI发布(beta/peon_static)
#### 注意事项
*	CI请选择peon_static
*	f2eci.json配置文件说明

```javascript
"scripts":{
	"prebuild":"",		//build前执行的命令，时机早于build
   	"build":"",       //build前执行的命令
   	"postpublish":""  //全部完成后的hook脚本
},
"dist":["./dist","./path/to"]，     //build后要上传发布的目录
"env":"beta",	//alpha , beta ,ppe , product
"urlPrefix":"./"	//www.dpfile.com/app/peon-demo/
```
	
*	访问

```
访问html页面    h5.dianping.com/app/peon-demo/path/to/file.html
访问其余静态资源  www.dpfile.com/app/peon-demo/path/to/file.min.md5.ext

beta环境对应的域名分别为 h5.51ping.com 和 s1.51ping.com
```