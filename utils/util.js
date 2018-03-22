/**
 * 格式：2017/09/09 09:08:10
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 格式：09月09日(星期六)
 */
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const week = date.getDay()

  return month + '月' + day + '日(' + getWeek(week) + ') '
}

/**
 * 格式：2017-09-09
 */
const formatDate2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 格式：09月09日(星期六)
 */
const formatDate3 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const week = date.getDay()

  return month + '月' + day + '日(' + getWeek(week) + ')' + [hour, minute].map(formatNumber).join(':')
}

/**
 * 格式：09:30
 */
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const week = date.getDay()

  return [hour, minute].map(formatNumber).join(':')
}

/**
 * 加零
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取当前日期星期
 */
const getWeek = num => {
  var week = "周";
  switch (num) {
    case 1:
      return week + "一";
      break;
    case 2:
      return week + "二";
      break;
    case 3:
      return week + "三";
      break;
    case 4:
      return week + "四";
      break;
    case 5:
      return week + "五";
      break;
    case 6:
      return week + "六";
      break;
    case 0:
      return week + "日";
      break;
    default:
      break
  }
}

/**
 * 提示弹窗
 */
const showTip = content => {
  wx.showModal({
    title: '提示',
    content: content,
    success: function (res) {
      if (res.confirm) {
      } else if (res.cancel) {
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDate2: formatDate2,
  formatDate3: formatDate3,
  formatTime2: formatTime2,
  getWeek: getWeek,
  showTip: showTip,
}
