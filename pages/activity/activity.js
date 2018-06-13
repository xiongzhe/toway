// pages/activity/activity.js

//获取应用实例
const app = getApp()

const util = require('../../utils/util.js')
var net = require('../../net.js')
var api = require('../../api.js')
//活动详情数据
var activityInfo
//跳转来源 1 首页 3 我的
var tab
//活动id
var activityId
//是否显示授权按钮
var isShowButton = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentDisplay: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    })

    tab = options.tab
    activityId = options.activityId
    wx.getSystemInfo({
      success: function (res) {
        screenWidth: res.screenWidth
        imageHeight: '200rpx'
      },
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
      wx.showLoading({
        title: '加载中...',
      })
      getActivityInfo(activityId, this);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return {
      title: activityInfo.title,
      path: '/pages/activity/activity?activityId=' + activityId + '&tab=1',
      success: function (res) {
        //util.showTip('转发成功')
      },
      fail: function (res) {
        //util.showTip('转发失败')
      }
    }
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
      function (res) {
        isShowButton = false;
        _this.setData({
          isShowButton: isShowButton,
          contentDisplay: 'block',
        })
        var userInfo = res;
        getActivityInfo(activityId, _this);
      },
      //未授权
      function (res) {
        isShowButton = true;
        _this.setData({
          isShowButton: isShowButton
        });
        wx.hideLoading();
      });
  },

  /**
   * 名单
   */
  members: function (e) {
    wx.navigateTo({
      url: '/pages/members/members?activityId=' + activityInfo.id
    })
  },

  /**
   * 报名
   */
  apply: function (e) {
    var isEdit = activityInfo.edit;
    var isApply = activityInfo.is_entry;
    var applyText;
    if (isEdit && activityInfo.status == 1) {//自己发布的活动
      more();
    } else if (!isApply && activityInfo.status == 1) {
      wx.navigateTo({
        url: '/pages/apply/apply?activityId=' + activityInfo.id
      })
    }
  },

  /**
   * 点击查看图片
   */
  onClickImages: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示下表
      current: activityInfo.activity_image[index],
      //数据源
      urls: activityInfo.activity_image
    })
  }
})

/**
 * 获取活动详情
 */
function getActivityInfo(activityId, _this) {
  var url = api['activity'] + "/" + activityId
  wx.request({
    url: url,
    method: 'GET',
    header: net.getHeader(),
    success: function (res) {
      if (res.data.code == 200) {
        console.log(res)
        activityInfo = res.data.data
        var time = activityInfo.detail_activity_date_text
        var isEdit = activityInfo.edit;
        var applyText, membersDisplay;
        var applyStatus = activityInfo.status
        var applyBgColor
        if (isEdit) {//自己发布的活动，可以编辑
          membersDisplay = 'block';
          if (applyStatus == 1) { //报名中
            applyText = '更多';
            applyBgColor = '#1fb681'
          } else if (applyStatus == 2) {//活动中
            applyText = '活动中';
            applyBgColor = '#999'
          } else if (applyStatus == 3) {//活动结束
            applyText = '活动结束';
            applyBgColor = '#999'
          }
        } else {
          membersDisplay = 'none';
          var isApply = activityInfo.is_entry;
          if (applyStatus == 1) { //报名中
            if (isApply) {
              applyText = '已报名';
              applyBgColor = '#999'
            } else {
              applyText = '我要报名';
              applyBgColor = '#1fb681'
            }
          } else if (applyStatus == 2) {//活动中
            applyText = '活动中';
            applyBgColor = '#999'
          } else if (applyStatus == 3) {//活动结束
            applyText = '活动结束';
            applyBgColor = '#999'
          }
        }
        _this.setData({
          membersDisplay: membersDisplay,
          headImg: activityInfo.user.avatar_url,
          name: activityInfo.user.name,
          time: time,
          title: activityInfo.title,
          phone: activityInfo.phone,
          price: activityInfo.price,
          address: activityInfo.address,
          detail: activityInfo.content,
          num: activityInfo.num,
          numLimit: activityInfo.total,
          imageArray: activityInfo.entry_user,
          applyText: applyText,
          activityImages: activityInfo.activity_image,
          applyBgColor: applyBgColor
        })
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
 * 更多
 */
function more() {
  wx.showActionSheet({
    itemList: ['重新编辑', '删除'],
    success: function (res) {
      var num = res.tapIndex
      if (num == 0) { //重新编辑
        wx.navigateTo({
          url: '/pages/republish/republish?activityInfo=' + JSON.stringify(activityInfo) + '&tab=1'
        })
      } else if (num == 1) { //删除
        wx.showModal({
          title: '提示',
          content: '真的要删除此条活动吗?\n我觉得我可以挽救一下',
          success: function (res) {
            if (res.confirm) {
              deleteActivity()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    fail: function (res) {
      console.log(res.errMsg)
    }
  })
}

/**
 * 删除活动
 */
function deleteActivity() {
  var url = api['activity'] + "/" + activityInfo.id
  wx.request({
    url: url,
    method: 'DELETE',
    header: net.getHeader(),
    success: function (res) {
      var errorMsg
      if (res.data.code == 200) {
        wx.showModal({
          title: '提示',
          content: '删除成功',
          success: function (res) {
            if (res.confirm) {
              if (tab == 1) {
                //跳转至首页
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              } else if (tab == 2) {
                //返回
                wx.reLaunch({
                  url: '/pages/publish/publish'
                })
              } else if (tab == 3) {
                //跳转至我的
                wx.reLaunch({
                  url: '/pages/my/my'
                })
              } else if (tab == 4) {
                //跳转至我的
                wx.redirectTo({
                  url: '/pages/republish/republish'
                })
              }
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