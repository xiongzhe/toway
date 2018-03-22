// pages/members/members.js

//获取应用实例
const app = getApp()

const util = require('../../utils/util.js')
var net = require('../../net.js')
var api = require('../../api.js')
var array = []
var activityId
const pageSize = 20
var page = 1

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //memeberArray: memebers
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //设置不可转发
    wx.hideShareMenu();
    
    activityId = options.activityId;
    wx.showLoading({
      title: '加载中...',
    })
    var userInfo = app.globalData.userInfo
    if (userInfo) {
      getMemebers(this);
    } else {
      app.getUserInfo(that, function (res) {
        var userInfo = res;
        getMemebers(this);
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    page = 1
    array = []
    this.setData({
      array: array,
      loadDisplay: 'none',
    });
    getMemebers(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    loadMore(this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

/**
 * 加载更多
 */
function loadMore(_this) {
  _this.setData({
    loadDisplay: 'block',
    loadMoreText: '玩命的加载中...'
  })
  wx.showNavigationBarLoading() //在标题栏中显示加载
  page++;
  getMemebers(_this)
}

/**
 * 活动报名名单
 */
function getMemebers(_this) {
  wx.request({
    url: api['entry/entry-list'],
    method: 'GET',
    data: {
      "activity_id": activityId,
      page: page,
      page_size: pageSize
    },
    header: net.getHeader(),
    success: function (res) {
      console.log(res)
      if (res.data.code == 200) {
        var curArray = res.data.data.data
        array = array.concat(curArray)
        var loadMoreText, loadDisplay
        _this.setData({
          sellNum: res.data.data.total,
          array: array,
          loadDisplay: 'none',
        })
        if (curArray == null || curArray.length < 10) {
          _this.setData({
            loadDisplay: 'display',
            loadMoreText: '没有更多了'
          })
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading()
      } else if (res.data.code == 601) {
        var errors = res.data.errors
        for (var key in errors) {
          var value = errors[key]
          util.showTip(value[0])
          break
        }
      } else {
        util.showTip(res.data.message)
      }
    },
    fail: function (res) {
      util.showTip(res)
      wx.hideLoading()
    }
  })
}