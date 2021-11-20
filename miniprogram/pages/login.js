function getUserProfile(){
  wx.getUserProfile({
    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      // this.setData({
      //   userInfo: res.userInfo,
      //   hasUserInfo:true
      // })
      wx.setStorageSync('userInfo', res.userInfo)
      getOpenId()
    }
  })
}


function getOpenId() {
  wx.showLoading({
    title: '登陆中',
  })
 wx.cloud.callFunction({
    name: 'quickstartFunctions',
    config: {
      // env: this.data.envId
    },
    data: {
      type: 'getOpenId'
    }
  }).then((resp) => {
    // this.setData({
    //   haveGetOpenId: true,
    //   openId: resp.result.openid
    // })
   wx.setStorageSync('openId', resp.result.openid)

   console.log(resp)
   wx.hideLoading()
 }).catch((e) => {
    // this.setData({
    //   showUploadTip: true
    // })
   wx.hideLoading()
  })
}
module.exports={
  getOpenId:getOpenId,
  getUserProfile:getUserProfile
}