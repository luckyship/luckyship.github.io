---
layout: post
title: hls.js播放hls直播源
excerpt: '播放码流视频源'
tags: [web, javascript, video]
comments: true
date: 2020-12-15 13:15:32
---
## video.js和hls.js的区别和优缺点

### video.js：
优点：功能比较强大，有很多功能封装好了，而且有自己的一套UI，在不同浏览器下显示比较一致
缺点：包比较大，实现hls直播的时候其实是内嵌了hls.js的代码，实际上是运用了hls.js，而且由于封装的ui和功能，使其不够纯净，不够灵活，修改ui的时候要用到其他的插件，有点画蛇添足的感觉
### hls.js：
优点：包比较小，很纯净，UI可以根据自己的业务自扩展，自己封装功能和UI，比较切合自己开发的直播播放器，而且专业直播HLS
缺点：没有封装好的UI，功能上也需要自己去实现

hls.js播放hls直播源
```
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>hls.js</title>
    <link rel="stylesheet" href="./index.css">
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  </head>
  <body>
    <video id="video" controls></video>
    <script src="./index.js" charset="utf-8"></script>
  </body>
</html>
```
`index.js`
```
var Hls = window.Hls
var url = 'http://localhost:8765/hls/movie.m3u8'
var video = document.getElementById('video')
if (Hls.isSupported()) {
  var hls = new Hls()
  hls.loadSource(url)
  hls.attachMedia(video)
  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    // video.play()
  })
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = url
  video.addEventListener('canplay', function () {
    // video.play()
  })
}
```
