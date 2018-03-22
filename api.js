var host = 'https://toway.quoyle.info/api/'

//api 地址
module.exports = {
  //微信登录接口
  'wx-login': host + 'wx-login',
  //保存用户信息
  'user/save-user-info': host + 'user/save-user-info',
  //发布活动/活动列表/活动详情
  'activity': host + 'activity',
  //上传图片
  'upload/img': host + 'upload/img',
  //报名
  'entry': host + 'entry',
  //活动报名名单    
  'entry/entry-list': host + 'entry/entry-list',
}