  // 此方法没有半颗星的状态
  // 原理是将 5 => [1,1,1,1,1] ; 3.5 => [1,1,1,0,0]
  function convertToStarsArray(stars) {
      var num = stars.toString().substring(0, 1);
      var array = [];
      for (var i = 1; i <= 5; i++) {
          if (i <= num) {
              array.push(1)
          } else {
              array.push(0)
          }
      }
      return array;
  }

  // 把演员名用斜线分割开
  function convertToCastString(casts) {
      var castsjoin = "";
      for (var idx in casts) {
          castsjoin = castsjoin + casts[idx].name + " / ";
      }
      return castsjoin.substring(0, castsjoin.length - 2)
  }
  // 演员头像和名字
  function convertToCastInfos(casts) {
      var castsArray = []
      for (var idx in casts) {
          var cast = {
              img: casts[idx].avatars ? casts[idx].avatars.large : "",
              name: casts[idx].name
          }
          castsArray.push(cast);
      }
      return castsArray;
  }

  // 注意，一定要有callBack
  function http(url, callBack) {
      wx.request({
          url: url,
          method: 'GET',
          header: {
              'Content-Type': 'json'
          },
          success(res) {
              callBack(res.data)
            
          },
          fail(error) {
              console.log(error)
          }
      })
  }

  const formatTime = date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

  const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
  }

  module.exports = {
      formatTime: formatTime,
      convertToStarsArray: convertToStarsArray,
      convertToCastString: convertToCastString,
      convertToCastInfos: convertToCastInfos,
      http: http
  }