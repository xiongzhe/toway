// pages/my/my.js

const app = getApp()
const pageSize = 10

var net = require('../../net.js')
var api = require('../../api.js')
//发起活动列表
var lanuchedArray = []
//参与活动列表
var joinArray = []
//发起活动当前加载页
var lanuchedPage = 1
//参与活动当前加载页
var joinPage = 1
//当前tab 1 发起活动 2 参与活动
var curTab = 2
//是否显示授权按钮
var isShowButton = true;
//是否获取过数据（获取过之后就不用在onShow中重复获取了）
var isFisrtGetData = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lanuchedBottomDisplay: 'none',
    contentDisplay: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //设置不可转发
    wx.hideShareMenu();

    this.setData({
      lanuchedArray: lanuchedArray,
      loadDisplay: 'none',
      isShowButton: true
    });
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
      this.setData({
        headImg: userInfo.avatarUrl,
        username: userInfo.nickName
      })
      if (!isFisrtGetData) {
        //初始化数据
        wx.showLoading({
          title: '加载中...',
        })
        initData(this)
        isFisrtGetData = true;
      }
      this.setData({
        isShowButton: isShowButton,
        contentDisplay: 'block'
      });
    } else {
      this.onGotUserInfo();
    }
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
    if (curTab == 1) {
      lanuchedPage = 1
      lanuchedArray = []
      this.setData({
        lanuchedArray: lanuchedArray,
        loadDisplay: 'none',
      })
    } else {
      joinPage = 1
      joinArray = []
      this.setData({
        joinArray: joinArray,
        loadDisplay: 'none',
      })
    }
    initData(this)
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

  },

  /**
   * 点击发起活动按钮事件
   */
  clickLanuchedList: function (e) {
    curTab = 1
    setTab(this)
    if (lanuchedArray.length == 0) {
      //初始化数据
      wx.showLoading({
        title: '加载中...',
      })
      initData(this)
    }
  },

  /**
   * 点击参与活动按钮事件
   */
  clickJoinList: function (e) {
    curTab = 2
    setTab(this)
    if (joinArray.length == 0) {
      //初始化数据
      wx.showLoading({
        title: '加载中...',
      })
      initData(this)
    }
  },

  /**
   * 点击发起活动列表item进入活动详情
   */
  onLanuchedItemClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var activityId = lanuchedArray[index].id
    wx.navigateTo({
      url: '/pages/activity/activity?activityId=' + activityId + '&tab=3'
    })
  },

  /**
   * 点击参与活动列表item进入活动详情
   */
  onJoinItemClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var activityId = joinArray[index].id
    wx.navigateTo({
      url: '/pages/activity/activity?activityId=' + activityId + '&tab=3'
    })
  },

  /**
   * 再发一次活动
   */
  publishAgain: function (e) {
    var index = e.currentTarget.dataset.index;
    var activityId = lanuchedArray[index].id
    wx.navigateTo({
      url: '/pages/republish/republish?activityId=' + activityId + '&tab=2'
    })
  },

  /**
   * 点击授权按钮获取用户信息
   */
  onGotUserInfo: function (e) {
    const _this = this
    wx.showLoading({
      title: '加载中...',
    })
    app.login(
      //已授权
      function (res) {
        isShowButton = false;
        var userInfo = res;
        _this.setData({
          isShowButton: isShowButton,
          headImg: userInfo.avatarUrl,
          username: userInfo.nickName,
          contentDisplay: 'block'
        })
        //初始化数据
        wx.showLoading({
          title: '加载中...',
        })
        initData(_this)
        isFisrtGetData = true;
      },
      //未授权
      function (res) {
        isShowButton = true;
        _this.setData({
          isShowButton: isShowButton
        });
        wx.hideLoading();
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
  if (curTab == 1) {
    lanuchedPage++;
  } else {
    joinPage++;
  }
  initData(_this)
}

/**
 * 初始化数据
 */
function initData(that) {
  var _this = that
  var userInfo = app.globalData.userInfo
  getActivityList(_this, userInfo);
}

/**
 * 获取活动列表
 */
function getActivityList(_this, userInfo) {
  var page
  if (curTab == 1) {
    page = lanuchedPage
  } else {
    page = joinPage
  }
  wx.request({
    url: api['activity'],
    method: 'GET',
    data: {
      page: page,
      page_size: pageSize,
      screening: curTab
    },
    header: net.getHeader(),
    success: function (res) {
      console.log(res);
      if (res.data.code == 200) {
        var curArray = res.data.data.data
        var loadMoreText, loadDisplay
        if (curTab == 1) { //发起活动
          lanuchedArray = lanuchedArray.concat(curArray)
          _this.setData({
            lanuchedArray: lanuchedArray,
            loadDisplay: 'none',
          })
        } else {//参与活动
          joinArray = joinArray.concat(curArray)
          _this.setData({
            joinArray: joinArray,
            loadDisplay: 'none',
          })
        }
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
 * 设置当前tab
 */
function setTab(_this) {
  if (curTab == 1) {
    _this.setData({
      lanuchedListDisplay: 'block',
      joinListDisplay: 'none',
      lanuchedBottomDisplay: 'block',
      joinBottomDisplay: 'none'
    })
  } else {
    _this.setData({
      lanuchedListDisplay: 'none',
      joinListDisplay: 'block',
      lanuchedBottomDisplay: 'none',
      joinBottomDisplay: 'block'
    })
  }
}