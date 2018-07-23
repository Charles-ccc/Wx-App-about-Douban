let util = require('../../../../utils/util.js');
class Movie {
    constructor(url) { // url是豆瓣的地址
        this.url = url; // 将url绑定到实例里面
    }

    getMovieData(cb) { // cb是回调函数,movie-detail里的匿名方法
        this.cb = cb;
        util.http(this.url, this.processDoubanData.bind(this));
        // bind(this) 改变processDoubanData绑定到上下文环境，以至于在函数内可以使用this
    }

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
            // 需要返回movie，然后movie会传到movie-detail里匿名函数的参数里
        this.cb(movie)
    }
}

export { Movie }