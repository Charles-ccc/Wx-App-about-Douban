Page({
  data:{
  },
  onLoad(event) {
    let newsUrl = 'https://3g.163.com/touch/reconstruct/article/list/BA10TA81wangning/0-10.html'
    this.getNewsData(newsUrl)
  },
  getNewsData(newsUrl) {
    var that = this;
    wx.request({
      url: newsUrl,
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        that.processNewsData(res);
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  processNewsData(newsData) {
    // console.log(newsData);
    let newsTop = [];
    let newsItem = [];
    console.log(newsData)
    for(let i; i < newsData.length; i ++ ) {
      console.log(i)
    }
  }
})