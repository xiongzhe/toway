
const util = require('../utils/util.js')
var api = require('../api.js')
var net = require('../net.js')

class User {

  /*********** 微信老版本的授权 *************/
  // saveUserInfo(header, callback) {
  //   const self = this
  //   self.header = header
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         //已授权，获取用户信息
  //         self.getWXUserInfo(callback)
  //       } else {
  //         //未授权，调起授权
  //         wx.authorize({
  //           scope: 'scope.userInfo',
  //           success: function (res) {
  //             //已授权，获取用户信息
  //             self.getWXUserInfo(callback)
  //           }
  //         })
  //       }
  //     }
  //   })
  // }

  // //获取微信用户信息
  // getWXUserInfo(callback) {
  //   const self = this
  //   wx.getUserInfo({
  //     success: res => {
  //       var userData = res;
  //       wx.request({
  //         url: api['user/save-user-info'],
  //         header: self.header,
  //         method: 'POST',
  //         data: res,
  //         success: function (res) {
  //           if (res.data.code == 200) {
  //             callback(userData.userInfo)
  //           } else if (res.data.code == 601) {
  //             util.showTip(res.data.errors.content[0])
  //           } else {
  //             util.showTip(res.data.message)
  //           }
  //         },
  //         fail: function (res) {
  //           console.log(res);
  //         }
  //       })

  //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //       // 所以此处加入 callback 以防止这种情况
  //       if (this.userInfoReadyCallback) {
  //         this.userInfoReadyCallback(res)
  //       }
  //     }
  //   })
  // }

   /*********** 微信新版本的授权，必须通过button的方式授权 *************/
  //获取微信用户信息
  getWXUserInfo(data, callback) {
    var userData = data;
    wx.request({
      url: api['user/save-user-info'],
      header: net.getHeader(),
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.data.code == 200) {
          callback(userData.userInfo)
        } else if (res.data.code == 601) {
          util.showTip(res.data.errors.content[0])
        } else {
          util.showTip(res.data.message)
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })

    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
  }
}

module.exports = new User