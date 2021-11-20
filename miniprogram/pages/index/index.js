const db = wx.cloud.database()
var common = require('../common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBarText:"登陆恋爱盲盒",
    showUploadTip: false,
    haveGetOpenId: false,
    url:"",
    envId: '',
    openId: '',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:common.url
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    try {
      wx.getStorageSync('openId')
    } catch (e) { 
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('openId', this.data.openId)
        wx.setStorageSync('userInfo', this.data.userInfo)
        this.getOpenId()
      }
    })
  },
  // 添加用户数据
  addUserInfo:result=>{

    db.collection('love_user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        wx_id:result.openId,
        user_info:result.userInfo,
        body_type:false,
        goid:0,
        type:0,
        age:null,
        sex:null
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        wx.switchTab({
          url:'/pages/loveBox/index',
        })
        common.upGold(result.openId,2,"注册奖励")
      }
    })
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
 // 登陆获取openid
 getOpenId() {

  wx.showLoading({
    title: '登陆中',
  })
 wx.cloud.callFunction({
    name: 'quickstartFunctions',
    config: {
      env: this.data.envId
    },
    data: {
      type: 'getOpenId'
    }
  }).then((resp) => {
  
    this.setData({
      haveGetOpenId: true,
      openId: resp.result.openid
    })
    this.addUserInfo(this.data)
   wx.hideLoading()
 }).catch((e) => {

    this.setData({
      showUploadTip: true
    })
   wx.hideLoading()
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
    
  }
})