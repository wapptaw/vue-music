1. 坑点： 不要把babel的option写在webpack配置文件里，因为vue文件也要转码（大概），不然...mapState等不管用
2. 水平方向，块元素在不手动设置宽度时，其宽度总是等于容器的宽度
3. img标签默认与父元素的baseline对齐的，而baseline与父元素底部有一定距离，所以img元素底部会与父元素底部有一定空隙，可以设置vertical-align来解决这个问题
http://m10.music.126.net/20180425165633/e6b348458dc698e40c72cf231ca9bc60/ymusic/73f7/3079/d18b/45fc7945379924c9be0e11d416d39d7c.mp3

http://m10.music.126.net/20180425165633/da7b80a122e18f227ec6795edbe48387/ymusic/fccf/9f62/e48b/d2dcf1b593c71cff5a29903a7aad7fe8.mp3

loadstart 当浏览器开始查找音频/视频时
durationchange 当音频/视频的时长已更改时
loadedmetadata 当浏览器已加载音频/视频的元数据时
loadeddata 当浏览器已加载音频/视频的当前帧时
progress 当浏览器正在下载音频/视频时
canplay 当浏览器可以播放音频/视频时
canplaythrough 当浏览器可在不因缓冲而停顿的情况下进行播放时