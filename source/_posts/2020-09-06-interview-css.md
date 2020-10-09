---
layout: post
title: "整理面试相关"
date: 2020-09-06
excerpt: "主要是一些关于web的知识, 记录一些要点"
tags: [web, javascript, html, css]
comments: true
---

简单记录一下面试的一些要点

## javascript事件机制  
先捕获，后冒泡，捕获从上到下，冒泡从下到上
### 冒泡机制
IE提出的事件流叫做事件冒泡，即事件开始时由最具体的元素接收，然后逐级向上传播到较为不具体的节点，看一下以下示例
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body onclick="bodyClick()">

    <div onclick="divClick()">
        <button onclick="btn()">
            <p onclick="p()">点击冒泡</p>
        </button>
    </div>
    <script>
       
       function p(){
          console.log('p标签被点击')
       }
        function btn(){
            console.log("button被点击")
        }
         function divClick(event){
             console.log('div被点击');
         }
        function bodyClick(){
            console.log('body被点击')
        }

    </script>

</body>
</html>
```
结果显而易见
```
p标签被点击
button被点击
div被点击
body被点击
```
### 捕获机制
 事件捕获流的思想是不太具体的DOM节点应该更早接收到事件，而最具体的节点应该最后接收到事件，针对上面同样的例子，点击按钮，那么此时click事件会按照这样传播：（下面我们就借用addEventListener的第三个参数来模拟事件捕获流）
 ```
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<div>
    <button>
        <p>点击捕获</p>
    </button>
</div>
<script>
    var oP=document.querySelector('p');
    var oB=document.querySelector('button');
    var oD=document.querySelector('div');
    var oBody=document.querySelector('body');

    oP.addEventListener('click',function(){
        console.log('p标签被点击')
    },true);

    oB.addEventListener('click',function(){
        console.log("button被点击")
    },true);

    oD.addEventListener('click',  function(){
        console.log('div被点击')
    },true);

    oBody.addEventListener('click',function(){
        console.log('body被点击')
    },true);

</script>
 ```
 与冒泡相反的结果
 ```
 body被点击
 div被点击
 button被点击
 p标签被点击
 ```

 ## css省略文字的实现

 ```
 overflow: hidden;
 white-space: nowrap;
 text-overflow: allipsis
 ```

 ## settimeout, setinterval，eval在赋值时有什么问题？
 ## vue解决跨域问题
### 什么是跨域

跨域：由于浏览器同源策略，凡是发送请求url的协议、域名、端口三者之间任意一个与当前页面地址不同即为跨域。存在跨域的情况：

* 网络协议不同，如http协议访问https协议。
* 端口不同，如80端口访问8080端口。
* 域名不同，如qianduanblog.com访问baidu.com。
* 子域名不同，如abc.qianduanblog.com访问def.qianduanblog.com。
* 域名和域名对应ip,如www.a.com访问20.205.28.90.

下面是项目使用vue-cli脚手架搭建  
使用http-proxy-middleware 代理解决跨域问题  
例如请求的url:“http://f.apiplus.cn/bj11x5.json”  
1、打开config/index.js,在proxyTable中添写如下代码：
```
proxyTable: {
  '/api': {  //使用"/api"来代替"http://f.apiplus.c"
    target: 'http://f.apiplus.cn', //源地址
    changeOrigin: true, //是否跨域
    pathRewrite: {
      '^/api': 'http://f.apiplus.cn' //路径重写
      }
  }
}
```
2、使用axios请求数据时直接使用“/api”：
```
getData () {
axios.get('/api/bj11x5.json', function (res) {
  console.log(res)
})
```
通过这中方法去解决跨域，打包部署时还按这种方法会出问题。解决方法如下：
```
let serverUrl = '/api/'  //本地调试时
// let serverUrl = 'http://f.apiplus.cn/'  //打包部署上线时
```
## vue解决xss注入问题
1.在终端引入xss,命令：
```
npm install xss --save
```
2.在vue的页面进行引入
```
import xss from 'xss'
```
3.定义一个变量进行测试   
首先测试一个没有进行防止xss攻击的测试
```
<p v-html="test"></p>
 
export default {
  data () {
    return {
      test: `<a onclick='alert("xss攻击")'>链接</a>`
    }
```
结果，js事件直接被翻译了
```
xss攻击
```
因此应该杜绝这些情况，解决方法如下
```
<p v-html="$xss(test)"></p>
import xss from 'xss'
export default {
  data () {
    return {
      test: `<a onclick='alert("xss攻击")'>链接</a>`
    }
}
 
Object.defineProperty(Vue.prototype, '$xss', {
  value: xss
})
```
此时a标签会保留，但是onclick事件被拦截了

## vue axios的几种请求方式
axios的请求方法：get、post、put、patch、delete

* get：获取数据
* post：提交数据（表单提交+文件上传）
* put：更新数据（所有数据推送到后端）
* patch：更新数据（只将更改的数据推送到后端）
* delete：删除数据
```
//axios的get请求第一种写法不带参数
axios.get('/data.json').then((res)=>{
  console.log(res)
}),

//axios的get请求第一种写法带参数
axios.get('/data.json',{
  params:{
    id:12
  }
}).then((res)=>{
  console.log(res)
}),

//axios的get请求第二种写法不带参数
axios({
  method:'get',
  url:'/data.json',
}).then(res=>{
  console.log(res)
}),

//axios的get请求第二种写法带参数
axios({
  method:'get',
  url:'/data.json',
  params:{
    id:12
  },
}).then(res=>{
  console.log(res)
}),

//axios的post请求第一种写法
let data = {
  id:12
}
axios.post('/post',data).then((res)=>{
  console.log(res)
}),

//axios的post请求第二种写法
axios({
  method:'post',
  url:'/post',
  data:data
}).then(res=>{
  console.log(res)
}),

//form-data请求,图片上传、文件上传，文件格式为：multipart/form-data，其他请求为application/json

let formData = new formData()
for(let key in data){
  formData.append(key,data[key])
},
axios.post('/post',formData).then(res=>{
  console.log(res)
})

//axios之put请求
axios.put('/put',data).then(res=>{
  console.log(res)
})

//axios之patch请求
axios.patch('/patch',data).then(res=>{
  console.log(res)
}),

  //axios之delete请求的第一种写法
  axios.delete('/delete',{
    params:{
      id:12
    }
  }).then(res=>{
    console.log(res)
  })
//说明:当使用第一种写法参数为params时，请求接口时参数是放在URL里面的。
// 例：http://localhost:8080/delete?id=12,而写成第二种方法data就不会，根据实际情况使用

//axios之delete请求的第二种写法
axios.delete('/delete',{
  data:{
    id:12
  }
}).then(res=>{
  console.log(res)
})
```
