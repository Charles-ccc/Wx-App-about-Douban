const postsData = require('../../../data/posts-data.js')
const app = getApp(); // 拿到app.js的全局变量
Page({
    data: {
        // 可以通过设置其他的变量来传递参数
        isPlayingMusic: false
    },
    onLoad(option) {
        // let globalData = app.globalData;
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

        this.setMusicM();

        // 获取全局变量中的播放状态,同时修改页面中对状态作出修改
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            // this.data.isPlayingMusic = true;
            this.setData({
                isPlayingMusic: true
            })
        }
    },
    setMusicM() {
        // 监听音乐 总控开关同步页面开关
        let that = this;
        wx.onBackgroundAudioPlay(() => {
            that.setData({
                    isPlayingMusic: true
                })
                // 修改全局播放状态
            app.globalData.g_isPlayingMusic = true;
            // 修改全局变量中播放音乐的id
            app.globalData.g_currentMusicPostId = that.data.currentPostId
        })
        wx.onBackgroundAudioPause(() => {
                that.setData({
                    isPlayingMusic: false
                })
                app.globalData.g_isPlayingMusic = false;
                // 暂停时，将全局变量置空
                app.globalData.g_currentMusicPostId = null;
            })
            // 音乐播放完之后，图标状态切换回来
        wx.onBackgroundAudioStop(() => {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            // 暂停时，将全局变量置空
            app.globalData.g_currentMusicPostId = null;
        })
    },

    // 收藏功能
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
    // 演示，异步使用getStorage
    // getPostsCollectedAsy () {
    //     var that = this;
    //     wx.getStorage({
    //         key: "posts_Collected",
    //         success(res) {
    //             var postsCollected = res.data;
    //             let postCollected = postsCollected[that.data.currentPostId];
    //             postCollected = !postCollected;
    //             postsCollected[that.data.currentPostId] = postCollected;
    //             that.showToast(postsCollected, postCollected);
    //         }
    //     })
    // }

    // onShareTap(event) {
    //     var itemList = [
    //         "分享给微信好友",
    //         "分享到朋友圈",
    //         "分享到QQ",
    //         "分享到微博"
    //     ]
    //     wx.showActionSheet({
    //         itemList: itemList,
    //         itemColor: "#405f80",
    //         success(res) {
    //             // res.cancel 用户是不是点击了取消按钮
    //             // res.tapIndex 数组元素的序号，从0开始
    //             wx.showModal({
    //                 title: "用户" + itemList[res.tapIndex],
    //                 content: "用户是否取消"+ res.cancel +"暂时还没有分享功能"
    //             })
    //         }
    //     })
    // },
    onShareAppMessage(res) {
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
    },
    // onShareTap(event) {
    //     // 清除指定缓存
    //     // wx.removeStorageSync('posts_Collected');
    //     // 清除所有缓存
    //     wx.clearStorageSync();
    // }
    // 小程序缓存的上线不能超过10MB
    onMusicTap(event) {
        // let currentPostId = this.data.currentPostId;
        let postData = postsData.postList[this.data.currentPostId];
        let isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }
})

// 播放功能的完善之路
// 从一开始的使用本地资源播放，到加载json来根据不同id播放不同音乐，然后讲总控开关的播放和暂停状态与页面中的播放暂停状态保持一致，调取了wx.onBackgroundAudioPlay，将isPlayingMusic的状态修改。然后是播放的时候，图标和背景图同时会切换。然后在appjs中设置了全局状态为false，为了解决播放时退出后再进来的时候，图标又显示未播放，原因是因为重新加载了一次onLoad，所以利用全局变量，来同步页面中的播放状态，并且在点击播放按钮的时候，同时修改全局播放状态的变量


// 在id=1的页面播放时，回退一层，进入id=2的页面，此时页面中的播放图标是显示播放中，但是播放是id=1的页面中的音乐，所以不同页面状态的图标不对。
//原因：在1页面中播放之后，g_isPlayingMusic会设置为true，此时进入2页面，重新经过onLoad，所以读取到g_isPlayingMusic还是为true，所以会导致进入其他页面还是会显示播放状态。
// 解决：在appjs中设置一个播放postId全局变量，默认为空，然后在监听播放和暂停的Api中修改全局的postId，并且在onLoad中针对全局进行判断app.globalData.g_currentMusicPostId === postId，如果为true，isPlayingMusic为true，即显示播放图标