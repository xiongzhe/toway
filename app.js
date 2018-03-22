//app.js

var net = require('net.js')
var api = require('api.js')
const user = require('controller/user.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     var url = api['wx-login'];
    //     var code = res.code;
    //     var _this = this;
    //     wx.request({
    //       url: url,
    //       method: 'GET',
    //       data: {
    //         "code": code
    //       },
    //       header: net.getHeader(),
    //       success: function (res) {
    //         net.setAuthorization(res.data.data.token)
    //         user.saveUserInfo(net.getHeader(), function (res) {
    //           _this.globalData.userInfo = res;
    //           console.log(_this.globalData.userInfo);
    //         })
    //       },
    //       fail: function (res) {
    //         console.log(res);
    //       }
    //     })
    //   }
    // })
  },


  /**
   * 获取用户信息
   */
  getUserInfo: function (that, callback) {
    var groupData = this.globalData;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var url = api['wx-login'];
        var code = res.code;
        var _this = that;
        wx.request({
          url: url,
          method: 'GET',
          data: {
            "code": code
          },
          header: net.getHeader(),
          success: function (res) {
            net.setAuthorization(res.data.data.token)
            user.saveUserInfo(net.getHeader(), function (res) {
              groupData.userInfo = res;
              if (callback != null) {
                callback(res)
              }
            })
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    })
  },


  /**
   * 多张图片上传
   */
  uploadimg: function (data, callback) {
    var that = this
    var i = data.i ? data.i : 0
    var success = data.success ? data.success : 0
    var fail = data.fail ? data.fail : 0
    var imagesData = data.imagesData ? data.imagesData : []
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      header: {
        'Content-type': 'multipart/form-data',
        'x-requested-with': 'XMLHttpRequest',
        'Accept': 'text/json',
        'Authorization': net.getAuthorization()
      },
      success: (res) => {
        var dataJson = JSON.parse(res.data)
        if (dataJson.code == 200) {
          success++
          console.log("upload success" + res)
          imagesData[i] = dataJson.data.url
        }
      },
      fail: (res) => {
        fail++
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;
        data.imagesData = imagesData;
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          callback(data)
        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data, callback);
        }
      }
    });
  },

  globalData: {
    userInfo: null
  }
})