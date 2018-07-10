var postsData = require('../../data/posts-data.js')

Page({
    data: {

    },
    onLoad() {
        // this.data.postList = postData.postList
        // 如果是异步操作，就需要如下列赋值
        this.setData({
            post_key: postsData.postList
        })
    },
    onPosttap(event) {
        var postId = event.currentTarget.dataset.postid;
        // event 事件对象； currentTarget 当前鼠标点击对象； dataset 所有自定义属性的集合
        // console.log(event.currentTarget.dataset);
        wx.navigateTo({
            // 与原生的页面跳转一致，url后跟随参数跳转
            url: "post-detail/post-detail?id=" + postId
        })
    }
})