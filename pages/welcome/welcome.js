Page({
    data: {
        motto: 'Hello World',

    },
    //事件处理函数
    bindViewTap: function(event) {
        // wx.navigateTo({
        //   url: '../posts/post'
        // });
        // console.log("tap")

        // 页面平行跳转，不可回跳
        wx.redirectTo({
            url: '../post/post'
        });

        // wx.navigateTo({
        //   url: 'String',
        //   success: function(res){
        //     // success
        //   },
        //   fail: function() {
        //     // fail
        //   },
        //   complete: function() {
        //     // complete成功失败都执行
        //   }
        // });



    },
    onteztop: function() {
        //  console.log(" ssssonteztop")
    },

    onHide: function() {
        // 当页面隐藏
        // console.log("onHide")
    },
    onUnload: function() {
        //当页面关闭
        // console.log("onUnload")
    }

})