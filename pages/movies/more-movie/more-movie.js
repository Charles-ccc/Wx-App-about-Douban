// scroll-view不再支持下拉刷新 onPullDownRefresh()
// 修改教程 https://www.zhihu.com/search?type=content&q=scroll-view
let util = require('../../../utils/util.js');
let app = getApp(); // 引用全局变量
Page({
    data: {
        movies: [],
        navigateTitle: "",
        requestUrl: "",
        totalCount: 0,
        isEmpty: true
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
    // 框架触发 scroll-view
    // onScrollLower(event) {
    //     var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    //     // 获取数据 改变了参数
    //     util.http(nextUrl, this.processDoubanData);
    //     wx.showNavigationBarLoading(); // 加载等待图
    // },
    onReachBottom: function(event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },
    // 新增下拉刷新，也会触发下面方法
    onPullDownRefreash(event) {
        var refreshUrl = this.data.requestUrl + "?start=0&count=20";
        // 将movies置空，将状态改为true，否则每次刷新都会加载相同的20条数据
        this.data.movies = {};
        this.data.Empty = true;
        // 每次刷新都是从0开始
        this.data.totalCount = 0;
        util.http(refreshUrl, this.processDoubanData);
        wx.showNavigationBarLoading(); // 加载等待图
    },
    onMovieTap(event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "../movie-detail/movie-detail?id=" + movieId
        })
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

        var totalMovies = {};
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!this.data.Empty) {
            // empty非空，不是第一次加载数据，所以要对数据进行叠加
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            // movies赋值给totalMovies之后，就不是第一次取数据了，所以false
            this.data.Empty = false;
        }
        this.setData({
                movies: totalMovies
            })
            // 每在数据绑定之后，都给totalCount 加20 ，数据累加
        this.data.totalCount += 20;
        wx.hideNavigationBarLoading() // 数据加载结束后，就隐藏
        wx.stopPullDownRefresh() // 停止下拉刷新
            // console.log(movies);
    },
    onReady(event) {
        // 事实上是可以在onLoad中设置的，但文档强调不要在onReady前使用
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        })
    }
})