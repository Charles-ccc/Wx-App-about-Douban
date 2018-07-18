let util = require('../../../utils/util.js');
let app = getApp(); // 引用全局变量
Page({
    data: {
        movies: "",
        navigateTitle: "",
        requestUrl: "",
        totalCount: 0
    },
    onLoad(options) {
        var category = options.category;
        // console.log(category);
        // 将 category 保存至data中，方便其他位置调用
        this.data.navigateTitle = category;
        var dataUrl = "";
        // 根据所点击的category来判断
        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        this.data.requestUrl = dataUrl;
        // console.log(dataUrl)
        // 获取数据
        util.http(dataUrl, this.processDoubanData)
    },
    onScrollLower(event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        // 获取数据 改变了参数
        util.http(nextUrl, this.processDoubanData)
    },
    processDoubanData(moviesDouban) {
        // moviesDouban 是 util中函数返回出来的 callBack(data)
        console.log(moviesDouban);
        let movies = [];
        for (let idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            var temp = {
                // 依赖require内的函数
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)
        }
        // 每在数据绑定之前，都给totalCount 加20
        this.data.totalCount += 20;
        this.setData({
                movies: movies
            })
            // console.log(movies);
    },
    onReady(event) {
        // 事实上是可以在onLoad中设置的，但文档强调不要在onReady前使用
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        })
    }
})