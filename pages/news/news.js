let util = require('../../utils/util.js');

Page({
  data:{
    startCount: 0,
    isEmpty: true
  },
  onLoad(event) {
    let newsUrl = 'https://3g.163.com/touch/reconstruct/article/list/BA10TA81wangning/' + this.data.startCount + '-10.html'
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
        that.processNewsData(res.data);
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  processNewsData(newsData) {
    var that = this;
    var newsTop = [];
    var newsItem = [];
    var ret = newsData;
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/ // 匹配正则
      var matches = ret.match(reg);
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    var res = ret.BA10TA81wangning
    for (let i = 0; i < res.length; i++ ) {
      var modelmode = res[0].modelmode;
      if (i < 1) {
        newsTop.push(res[0])
      } else {
        res[i].ptime = that.getDateTimeStamp(res[i].ptime)
        res[i].ptime = that.getDateDiff(res[i].ptime)
        newsItem.push(res[i])
      }
    }
    var totalNews = {};
    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      // empty非空，不是第一次加载数据，所以要对数据进行叠加
      totalNews = this.data.newsItem.concat(newsItem);
    } else {
      totalNews = newsItem;
      this.data.isEmpty = false;
    }
    this.setData({
      newsTop: newsTop,
      newsItem: totalNews
    })
  },
  onReachBottom: function (event) {
    this.data.startCount += 10;
    var nextUrl = 'https://3g.163.com/touch/reconstruct/article/list/BA10TA81wangning/' + this.data.startCount + '-10.html';
    util.http(nextUrl, this.processNewsData)
    wx.showNavigationBarLoading()
  },
  // 时间格式转时间戳
  getDateTimeStamp(dateStr){
    return Date.parse(dateStr.replace(/-/gi, "/"));
  },
  // 时间戳转xx小时前
  getDateDiff(dateTimeStamp) {
    var result;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      if (monthC <= 12) result = "" + parseInt(monthC) + "月前";
      else {
        result = "" + parseInt(monthC / 12) + "年前";
      }
    } else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
  }
})