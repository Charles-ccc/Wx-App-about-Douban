var postData = require('../../data/posts-data.js')

Page({
  data : {
    
  },
  onLoad () {
    // this.data.postList = postData.postList
    // 如果是异步操作，就需要如下列赋值
    this.setData({
      post_key: postData.postList
    })
  }
})