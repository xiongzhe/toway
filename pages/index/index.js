//index.js

//获取应用实例
const app = getApp()
const user = require('../../controller/user.js')
const pageSize = 10

var net = require('../../net.js')
var api = require('../../api.js')
var array = []
var page = 1
//是否有显示历史标签
var isShowHistory = false;
//是否显示授权按钮
var isShowButton = true;
//是否获取过数据（获取过之后就不用在onShow中重复获取了）
var isFisrtGetData = false;

Page({

  data: {
    scrollTop: 0,
    loadDisplay: 'none',
    contentDisplay: 'none',
    array: [],
  },

  onLoad: function (options) {

    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    })
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
    var userInfo = app.globalData.userInfo
    if (userInfo) {
      isShowButton = false;
      if (!isFisrtGetData) {
        wx.showLoading({
          title: '加载中...',
        })
        getActivityList(this, userInfo);
        isFisrtGetData = true;
      }
      this.setData({
        isShowButton: isShowButton,
        contentDisplay: 'block'
      });
    } else {
      isShowButton = true;
      this.setData({
        isShowButton: isShowButton
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
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
    isShowHistory = false
    initData(this)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    loadMore(this)
  },

  /**
   * 点击item进入活动详情
   */
  onItemClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var activityId = array[index].id
    wx.navigateTo({
      url: '/pages/activity/activity?activityId=' + activityId + '&tab=1'
    })
  },

  /**
   * 点击授权按钮获取用户信息
   */
  onGotUserInfo: function () {
    const _this = this
    wx.showLoading({
      title: '加载中...',
    })
    app.login(function (res) {
      isShowButton = false;
      _this.setData({
        isShowButton: isShowButton,
        contentDisplay: 'block'
      })
      var userInfo = res;
      getActivityList(_this, userInfo);
      isFisrtGetData = true;
    })
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
  initData(_this)
}

/**
 * 初始化数据
 */
function initData(that) {
  var _this = that
  var userInfo = app.globalData.userInfo
  if (userInfo) {
    getActivityList(_this, userInfo);
  } else {
    app.getUserInfo(that, function (res) {
      var userInfo = res;
      getActivityList(_this, userInfo);
    })
  }
}

/**
 * 获取活动列表
 */
function getActivityList(_this, userInfo) {
  wx.request({
    url: api['activity'],
    method: 'GET',
    data: {
      page: page,
      page_size: pageSize
    },
    header: net.getHeader(),
    success: function (res) {
      if (res.data.code == 200) {
        console.log(res);
        var curArray = res.data.data.data
        setHistoryDisplay(_this, curArray);
        array = array.concat(curArray)
        var loadMoreText, loadDisplay
        _this.setData({
          array: array,
          loadDisplay: 'none',
        })
        if (curArray == null || curArray.length < 10) {
          _this.setData({
            loadDisplay: 'display',
            loadMoreText: '没有更多活动了'
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
    }
  })
}

/**
 * 设置历史标签是否显示
 */
function setHistoryDisplay(_this, curArray) {
  for (var i = 0; i < curArray.length; i++) {
    if (curArray[i].status == 3 && !isShowHistory) {
      curArray[i].historyDisplay = 'block'
      curArray[i].itemHeight = '460rpx'
      isShowHistory = true
    } else {
      curArray[i].historyDisplay = 'none'
      curArray[i].itemHeight = '400rpx'
    }
  }
}