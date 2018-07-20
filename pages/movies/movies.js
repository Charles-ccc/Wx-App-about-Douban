let util = require('../../utils/util.js')
let app = getApp();

Page({
    data: {
        // 作为key 如果是对象，一定要给一个空值
        inTheaters: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanelShow: false,
        searchResult: {}
    },
    onLoad(event) {
        // 从第0页的前三条数据
        let inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        let comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        let top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        // 为了能区别找到相对应的数据对象，在后面增加key
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    onMoreTap(event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: "more-movie/more-movie?category=" + category
        })
    },
    onMovieTap(event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "movie-detail/movie-detail?id=" + movieId
        })
    },
    getMovieListData(url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            data: {},
            method: 'GET',
            header: {
                'Content-Type': 'json'
            },
            success(res) {
                //console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail(error) {
                console.log(error)
            }
        })
    },
    // 处理豆瓣返回的数据，抓取需要的
    // moviesDouban就是接收从豆瓣取回的res.data
    processDoubanData(moviesDouban, settedKey, categoryTitle) {
        // console.log(moviesDouban)
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
        // 要根据传递的settedKey变量，针对不同对象进行动态赋值
        var readyData = {};
        readyData[settedKey] = {
            // 设置属性值，movie-list-template方便调用
            movies: movies, // movies是上面的movies数组
            categoryTitle: categoryTitle
        };
        this.setData(readyData);
        // this.setData({
        //     movies: movies
        // })
        // console.log(movies);
    },
    // 通过控制变量来控制搜索列表页和电影页的显示隐藏，wxml中wx:if判断
    onBindFocus(event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },
    onCancelImgTap(event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            // 退出清空搜索内容
            searchResult: {}
        })
    },
    onBindConfirm(event) {
        // 获取input的value
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "")
    }

})