var postsData = require('../../../data/posts-data.js')

Page({
    data: {
        // 可以通过设置其他的变量来传递参数
    },
    onLoad(option) {
        var postId = option.id; // 从url中拿到id
        this.data.currentPostId = postId; //将postId添加至data中，供其他方法使用
        // var postData = postsData.postList[postId];
        // this.data.postData = postData;
        this.setData({
            postData: postsData.postList[postId]
        });

        // 初始化收藏功能
        // 从缓存中获取所有的状态
        var postsCollected = wx.getStorageSync('posts_Collected');
        // console.log(postsCollected)
        // 如果未获取到，也会默认false
        if (postsCollected) {
            // 获取对应postId的状态
            let postCollected = postsCollected[postId];
            // 需要再做一次判断，否则Setting data field "collected" to undefined is invalid.
            if (postCollected) {
                // console.log(postCollected);
                this.data.collected = postCollected;
                this.setData({
                    collected: postCollected
                })
            }
        } else {
            let postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_Collected', postsCollected);
        }


        // 在没有服务器的时候，可以直接存在缓存中
        // setStorage getStorage 异步 机上Sync就是同步
        // wx.setStorageSync('key', '火箭总冠军')
        // wx.setStorageSync('key', {
        //         game: "他强任他强",
        //         developer: "playgame"
        // })
        // 如果要修改的缓存，就直接重新复制

        wx.showShareMenu({ // 要求小程序返回分享目标信息 
            withShareTicket: true 
        }); 
    },
    onColletionTap(event) {
        let postsCollected = wx.getStorageSync('posts_Collected');
        // 获取当前文章是否被收藏
        let postCollected = postsCollected[this.data.currentPostId];
        // 进行取反操作，收藏变为未收藏，未收藏变为收藏
        postCollected = !postCollected;
        // 更新变量
        postsCollected[this.data.currentPostId] = postCollected;
        // 更新文章是否收藏的缓存
        // wx.setStorageSync('posts_Collected', postsCollected)
        //     // 更新数据绑定变量，从而切换图片
        // this.setData({
        //     collected: postCollected
        // })
        this.showToast(postsCollected, postCollected); // 必须加上this,否则报错
    },
    onShareTap(event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ]
        // wx.showActionSheet({
        //     itemList: itemList,
        //     itemColor: "#405f80",
        //     success(res) {
        //         // res.cancel 用户是不是点击了取消按钮
        //         // res.tapIndex 数组元素的序号，从0开始
        //         wx.showModal({
        //             title: "用户" + itemList[res.tapIndex],
        //             content: "用户是否取消"+ res.cancel +"暂时还没有分享功能"
        //         })
        //     }
        // })
        
    },
    onShareAppMessage (res) {
        let that = this;
        console.log
        if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(res.target)
        }
        return {
          title: '自定义转发标题',
          path: '/pages/post/post'
        }
    },
    showToast(postsCollected, postCollected) {
        var that = this;
        // 更新文章是否收藏的缓存
        wx.setStorageSync('posts_Collected', postsCollected);
        // 更新数据绑定变量，从而切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏" : "取消收藏",
            icon: 'success',
            duration: 2000
        })
    },
    showModal(postsCollected, postCollected) {
        // 在success中 环境作用域会改变，this指代的就会不同，所以在这里先定义一下this
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏文章？" : "取消收藏文章？",
            showCancel: "true",
            confirmText: "确认",
            confirmColor: "#405f80",
            cancelText: "取消",
            cancelColor: "#000",
            success(res) { // res.confirm 为true，表示用户点击确定按钮
                if (res.confirm) {
                    // 更新文章是否收藏的缓存
                    wx.setStorageSync('posts_Collected', postsCollected);
                    // 更新数据绑定变量，从而切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    }
    // onShareTap(event) {
    //     // 清除指定缓存
    //     // wx.removeStorageSync('posts_Collected');
    //     // 清除所有缓存
    //     wx.clearStorageSync();
    // }
    // 小程序缓存的上线不能超过10MB
})