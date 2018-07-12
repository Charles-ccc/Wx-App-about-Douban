Page({
    data: {
        motto: 'Hello World',

    },
    //事件处理函数
    bindViewTap(event) {
        // wx.navigateTo({
        //     url: '../post/post'
        // });
        // 页面平行跳转，不可回跳。但是跳转进去后tabBar消失了
        // wx.redirectTo({
        //     url: '../movies/movies'
        // });

        // 微信不再能用navigateTo 或者 redirectTo 跳转带有tabBar的页面
        // 必须使用wx.switchTab
        wx.switchTab({
            url: '../post/post'
        })
    }
})