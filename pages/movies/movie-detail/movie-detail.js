let util = require('../../../utils/util.js');
let app = getApp();

Page({
    data: {
        movie: {}
    },
    onLoad(options) {
        // 拿到电影id
        var movieId = options.id;
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
        util.http(url, this.processDoubanData);
    },
    processDoubanData(data) {
        if (!data) {
            return;
        }
        var director = {
            avatar: "",
            name: "",
            id: ""
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars.large != null) {
                // data.director 豆瓣里的数据
                director.avatar = data.directors[0].avatars.large;
            } else {
                director.avatar = ""
            }
            director.name = data.directors[0].name;
            // director.id = data.directors[0].id;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count ? data.wish_count : "0",
            commentCount: data.comments_count ? data.comments_count : "0",
            year: data.year,
            generes: data.genres.join("、 "),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        console.log(movie)
        this.setData({
            movie: movie
        })
    },
    // 查看图片
    viewMoviePostImg(event) {
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    }
})