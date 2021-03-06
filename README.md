## WxApp About Douban
学习微信小程序的第一个里程碑项目，豆瓣电影相关。

> * 启动页
> * 新闻阅读页
> * 新闻详情页，附带音乐播放功能
> * 电影列表页
> * 更多电影页，附带搜索功能
> * 电影详情页，附带海报点击方法功能

项目使用了大量的template模板，进行互相调用。
项目知识点在于
1. 从本地json和从豆瓣api获取数据，豆瓣api已经对小程序进行了封禁，需要借助代理。
2. 获取数据之后，将数据在各模板之间进行传递。这里有一个小诀窍，**编写模板的时候，从最小的模板开始编写起，叫做“自下而上”；而在获取数据并传递数据的时候，从最外层接收模板的位置开始，叫做“自下而上”**。
3. 音乐播放时的状态控制和音乐图标的显示情况，借助了全局变量去获取和改变状态。
4. 动态改变页面的navigationBarTitleText。
5. 在跳转的url中添加Id，并根据不同的页面Id跳转到对应的详情页。然后在详情页里从url中再获取Id
6. 电影列表页中，要根据不同的分类跳转到该分类下的更多电影页，是给方法新增了一个参数，把这个类别名传递到最后处理数据的方法里，然后动态赋值给对象，将该对象下的数据加入到data中。
7. 更多电影页的上滑加载和下拉刷新（下拉刷新已修改方法），并且添加了加载动画。
![1](https://github.com/Charles-ccc/Wx-App-about-Douban/blob/master/images/1.jpg?raw=true)
![2](https://github.com/Charles-ccc/Wx-App-about-Douban/blob/master/images/2.jpg?raw=true)
![3](https://github.com/Charles-ccc/Wx-App-about-Douban/blob/master/images/3.jpg?raw=true)
![4](https://github.com/Charles-ccc/Wx-App-about-Douban/blob/master/images/4.jpg?raw=true)