// pages/apply/apply.js

//获取应用实例
const app = getApp()

const util = require('../../utils/util.js')
var net = require('../../net.js')
var api = require('../../api.js')

var array = []
var sex = 2
var activityId

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //设置不可转发
    wx.hideShareMenu();

    activityId = options.activityId;
    var userInfo = app.globalData.userInfo
    if (userInfo) {
      getActivityOptions(this);
    } else {
      app.getUserInfo(that, function (res) {
        var userInfo = res;
        getActivityOptions(this);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 确认报名
   */
  confirm: function (e) {
    var data = e.detail.value;
    modify(data);
  },

  /**
   * 单选框选择事件
   */
  radioChange: function (e) {
    sex = e.detail.value;
  }
})

/**
 * 获取活动必选项
 */
function getActivityOptions(_this) {
  var url = api['activity'] + "/" + activityId + "/option"
  wx.request({
    url: url,
    method: 'GET',
    header: net.getHeader(),
    success: function (res) {
      if (res.data.code == 200) {
        array = res.data.data
        _this.setData({
          array: array
        })
      } else if (res.data.code == 601) {
        util.showTip(res.data.errors.content[0])
      } else {
        util.showTip(res.data.message)
      }
    }
  })
}

/**
 * 报名判断条件
 */
function modify(data) {
  var params = {};
  for (var i = 0; i < array.length; i++) {
    var key = array[i].key;
    if (data[key] == "") {
      util.showTip('请输入' + array[i].name)
      return
    } else {
      if (array[i].type == 'picker') {
        params[key] = sex
      } else {
        params[key] = data[key]
      }
    }
  }
  params['activity_id'] = activityId
  apply(params)
}

/**
 * 报名
 */
function apply(params) {
  wx.request({
    url: api['entry'],
    method: 'POST',
    data: params,
    header: net.getHeader(),
    success: function (res) {
      if (res.data.code == 200) {
        wx.showModal({
          title: '提示',
          content: '恭喜你，报名成功',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/activity/activity?activityId=' + activityId
              })
            } else if (res.cancel) {

            }
          }
        })
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
    }
  })
}