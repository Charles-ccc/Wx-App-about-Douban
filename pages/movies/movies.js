let app = getApp();

Page({
    onLoad(event) {
        let inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        let comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        let top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl);
        this.getMovieListData(comingSoonUrl);
        this.getMovieListData(top250Url);
    },
    getMovieListData(url) {
        wx.request({
            url: url,
            data: {},
            method: 'GET',
            header: {
                'Content-Type': 'json'
            },
            success(res) {
                console.log(res);
            },
            fail(error) {
                console.log(error)
            }
        })
    }
})