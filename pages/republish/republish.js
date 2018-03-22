// pages/publish/publish.js

//获取应用实例
const app = getApp()

const util = require('../../utils/util.js')
var images = []
var net = require('../../net.js')
var api = require('../../api.js')
//必选项(设置为0时即为选中，默认姓名选中)
var optionsId = [0, 2, 3, 4, 5]
var optionsIds = []
//开始、结束日期和时间
var startTime
var endTime
var sDate
var sTime
var eDate
var eTime
//活动详情数据
var activityInfo
//必选项颜色数组
var colorArray = []
//活动人数限制
var numLimit
//活动费用
var money
//主题色
var themeColor = '#1fb681'
//上传图片
var uploadImages = []
//活动图片
var activityImages = []
//跳转来源 1 活动详情 2 我的
var curTab

Page({
  data: {
    imageArray: images
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //设置不可转发
    wx.hideShareMenu();

    var data = options.activityInfo
    curTab = options.tab
    var confirmText
    if (curTab == 1) {
      confirmText = "确认修改"
    } else {
      confirmText = "确认发布"
    }
    this.setData({
      confirmText: confirmText
    })
    if (data == null) {
      var userInfo = app.globalData.userInfo
      if (userInfo) {
        getActivityInfo(options.activityId, this)
      } else {
        app.getUserInfo(that, function (res) {
          var userInfo = res;
          getActivityInfo(options.activityId, this)
        })
      }
    } else {
      activityInfo = JSON.parse(data)
      initData(this)
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
   * 监听活动详情输入
   */
  bindDetailInput: function (e) {
    var value = e.detail.value;
    this.setData({
      detailLong: value.length + ' / 2500'
    })
  },

  /**
   * 查看图片
   */
  checkImg: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示下表
      current: images[index],
      //数据源
      urls: images
    })
  },

  /**
   * 添加图片
   */
  addImg: function (e) {
    var imgNums = images.length;
    var _this = this;
    if (imgNums < 4) {
      wx.chooseImage({
        count: 4 - imgNums, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          uploadImgs(_this, res, imgNums)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '最多只能添加4张图片',
      })
    }
  },

  /**
   * 添加图片
   */
  deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    images.splice(index, 1);
    this.setData({
      imageArray: images
    })
  },

  /**
   * 选择开始时间(日期)
   */
  bindStartTimeDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var stringTime = e.detail.value
    const date = new Date(stringTime)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = date.getDay()

    sDate = year + "-" + month + "-" + day

    this.setData({
      startDate: month + '月' + day + '日(' + util.getWeek(week) + ')'
    })
  },

  /**
   * 选择开始时间(时间)
   */
  bindStartTimeTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    sTime = e.detail.value
    this.setData({
      startTime: e.detail.value
    })
  },

  /**
   * 选择结束时间(日期)
   */
  bindEndTimeDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var stringTime = e.detail.value;
    const date = new Date(stringTime);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = date.getDay()

    eDate = year + "-" + month + "-" + day

    this.setData({
      endDate: month + '月' + day + '日(' + util.getWeek(week) + ')'
    })
  },

  /**
   * 选择结束时间(时间)
   */
  bindEndTimeTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    eTime = e.detail.value
    this.setData({
      endTime: e.detail.value
    })
  },

  /**
   * 点击必填项(姓名)
   */
  clickName: function (e) {
    var color = this.data.nameColor;
    if (color == themeColor) {
      color = '#bbb';
      optionsId[0] = 1;
    } else {
      color = themeColor;
      optionsId[0] = 0;
    }
    this.setData({
      nameColor: color,
      nameBorderColor: color
    });
  },

  /**
   * 点击必填项(电话)
   */
  clickPhone: function (e) {
    var color = this.data.phoneColor;
    if (color == themeColor) {
      color = '#bbb';
      optionsId[1] = 2;
    } else {
      color = themeColor;
      optionsId[1] = 0;
    }
    this.setData({
      phoneColor: color,
      phoneBorderColor: color
    });
  },

  /**
   * 点击必填项(身份证号)
   */
  clickCardId: function (e) {
    var color = this.data.cardIdColor;
    if (color == themeColor) {
      color = '#bbb';
      optionsId[2] = 3;
    } else {
      color = themeColor;
      optionsId[2] = 0;
    }
    this.setData({
      cardIdColor: color,
      cardIdBorderColor: color
    });
  },

  /**
   * 点击必填项(性别)
   */
  clickSex: function (e) {
    var color = this.data.sexColor;
    if (color == themeColor) {
      color = '#bbb';
      optionsId[3] = 4;
    } else {
      color = themeColor;
      optionsId[3] = 0;
    }
    this.setData({
      sexColor: color,
      sexBorderColor: color
    });
  },

  /**
   * 点击必填项(年龄)
   */
  clickAge: function (e) {
    var color = this.data.ageColor;
    if (color == themeColor) {
      color = '#bbb';
      optionsId[4] = 5;
    } else {
      color = themeColor;
      optionsId[4] = 0;
    }
    this.setData({
      ageColor: color,
      ageBorderColor: color
    });
  },

  /**
   * 确认修改
   */
  confirm: function (e) {
    var data = e.detail.value;
    startTime = sDate + " " + sTime;
    endTime = eDate + " " + eTime;
    setOptionsIds();
    modify(data, this);
  }
})

/**
 * 初始化数据
 */
function initData(_this) {
  console.log(activityInfo)
  //设置开始时间、结束时间
  var reg = new RegExp('-', "g")
  var tempStartDate = activityInfo.start_date.replace(reg, '/')
  var tempEndDate = activityInfo.end_date.replace(reg, '/')
  var ssDate = util.formatDate(new Date(tempStartDate));
  var ssTime = util.formatTime2(new Date(tempStartDate));
  var eeDate = util.formatDate(new Date(tempEndDate));
  var eeTime = util.formatTime2(new Date(tempEndDate));
  sDate = util.formatDate2(new Date(tempStartDate));
  sTime = ssTime;
  eDate = util.formatDate2(new Date(tempEndDate));
  eTime = eeTime;
  startTime = sDate + " " + sTime;
  endTime = eDate + " " + eTime;
  //设置添加图片显示
  var imagesDisplay, addImgViewDisplay
  if (activityInfo.activity_image.length == 0) {
    imagesDisplay = 'none'
    addImgViewDisplay = 'block'
  } else {
    imagesDisplay = 'flex'
    addImgViewDisplay = 'none'
    images = activityInfo.activity_image
    activityImages = activityInfo.activity_image
    uploadImages = images
  }
  //设置必选项
  var optionsIds = activityInfo.options;
  for (var i = 0; i < optionsIds.length; i++) {
    switch (optionsIds[i]) {
      case 1:
        colorArray[0] = themeColor
        optionsId[0] = 0
        break
      case 2:
        colorArray[1] = themeColor
        optionsId[1] = 0
        break
      case 3:
        colorArray[2] = themeColor
        optionsId[2] = 0
        break
      case 4:
        colorArray[3] = themeColor
        optionsId[3] = 0
        break
      case 5:
        colorArray[4] = themeColor
        optionsId[4] = 0
        break
    }
  }
  //设置页面数据
  _this.setData({
    coverPicSrc: images[0],
    imgDisplay: 'block',
    picViewDisplay: 'none',
    title: activityInfo.title,
    detail: activityInfo.content,
    detailLong: activityInfo.content.length + ' / 2500',
    address: activityInfo.address,
    numLimit: activityInfo.total,
    phone: activityInfo.phone,
    money: activityInfo.price,
    startDate: ssDate,
    startTime: ssTime,
    endDate: eeDate,
    endTime: eeTime,
    nameColor: colorArray[0],
    nameBorderColor: colorArray[0],
    phoneColor: colorArray[1],
    phoneBorderColor: colorArray[1],
    cardIdColor: colorArray[2],
    cardIdBorderColor: colorArray[2],
    sexColor: colorArray[3],
    sexBorderColor: colorArray[3],
    ageColor: colorArray[4],
    ageBorderColor: colorArray[4],
    imagesDisplay: imagesDisplay,
    addImgViewDisplay: addImgViewDisplay,
    imageArray: images
  });
}

/**
 * 发布活动判断条件
 */
function modify(data, _this) {
  var curTimeStamp = Date.parse(new Date());
  var sTimeStamp = Date.parse(new Date(startTime));
  var eTimeStamp = Date.parse(new Date(endTime));
  if (data.title == "") {
    util.showTip('请输入活动标题')
  } else if (data.detail == "") {
    util.showTip('请输入活动详情')
  } else if (images.length == 0) {
    util.showTip('请添加图片')
  } else if (curTimeStamp > sTimeStamp) {
    util.showTip('开始时间必须晚于当前时间')
  } else if (sTimeStamp >= eTimeStamp) {
    util.showTip('结束时间必须晚于开始时间')
  } else if (data.address == "") {
    util.showTip('请输入活动地址')
  } else if (data.phone == "") {
    util.showTip('请输入组织者电话')
  } else if (data.phone.length != 11) {
    util.showTip('组织者电话格式错误')
  } else {
    publish(data, _this);
  }
}

/**
 * 上传图片
 */
function uploadImgs(_this, res, imgNums) {
  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  var tempFilePaths = res.tempFilePaths;
  if (tempFilePaths.length > 0) {
    wx.showLoading({
      title: '加载中...',
    })
    app.uploadimg({
      url: api['upload/img'],
      path: tempFilePaths
    }, function (res) {
      var imagesData = res.imagesData
      //所有图片上传成功
      for (var i = 0; i < tempFilePaths.length; i++) {
        images[imgNums + i] = tempFilePaths[i];
        uploadImages[imgNums + i] = imagesData[i];
      }
      //设置活动图片(默认第一张为封面图片）
      activityImages = uploadImages
      _this.setData({
        imageArray: images,
        imagesDisplay: 'flex',
        addImgViewDisplay: 'none'
      })
      wx.hideLoading()
    })
  }
}

/**
 * 修改活动
 */
function publish(data, _this) {
  if (data.money == "") {
    money = 0
  } else {
    money = data.money
  }
  if (data.numLimit == "") {
    numLimit = 0
  } else {
    numLimit = data.numLimit
  }
  var url, method
  if (curTab == 1) { //重新编辑
    url = api['activity'] + "/" + activityInfo.id
    method = 'PUT'
  } else { //再发一次
    url = api['activity']
    method = 'POST'
  }
  wx.request({
    url: url,
    method: method,
    data: {
      "address": data.address,
      "content": data.detail,
      "start_date": startTime,
      "end_date": endTime,
      "phone": data.phone,
      "price": data.money,
      "title": data.title,
      "total": numLimit,
      "images": activityImages,
      "options": optionsIds,

    },
    header: net.getHeader(),
    success: function (res) {
      console.log(res);
      if (res.data.code == 200) {
        var content
        if (curTab == 1) {
          content = '修改成功'
          //跳转至活动详情
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: content,
          })
        } else {
          content = '发布成功'
          wx.redirectTo({
            url: '/pages/activity/activity?activityId=' + activityInfo.id
          })
        }
        clearData(_this)
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
 * 设置必选项
 */
function setOptionsIds() {
  optionsIds.splice(0, optionsIds.length);
  for (var i = 0; i < optionsId.length; i++) {
    if (optionsId[i] == 0) {
      optionsIds.push(i + 1)
    }
  }
}

/**
 * 获取活动详情
 */
function getActivityInfo(activityId, _this) {
  wx.showLoading({
    title: '加载中...',
  })
  var url = api['activity'] + "/" + activityId
  wx.request({
    url: url,
    method: 'GET',
    header: net.getHeader(),
    success: function (res) {
      if (res.data.code == 200) {
        activityInfo = res.data.data
        initData(_this)
        wx.hideLoading()
      } else if (res.data.code == 601) {
        util.showTip(res.data.errors.content[0])
      } else {
        util.showTip(res.data.message)
      }
    }
  })
}

/**
 * 清除数据
 */
function clearData(_this) {
  uploadImages = []
  images = []
  activityImages = []
  _this.setData({
    imageArray: images,
    imagesDisplay: 'none',
    addImgViewDisplay: 'block'
  });
}