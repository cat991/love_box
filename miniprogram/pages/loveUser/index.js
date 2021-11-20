const db = wx.cloud.database()
const _ = db.command
var common = require('../common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    showUploadTip:false,
    haveGetOpenId: false,
    openId: '',
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userInfo'))
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
      openId:wx.getStorageSync('openId')
    })
    this.setData({
      url:common.url
    })

  },
  // 查看活动
  getActivity:e=>{
    wx.showToast({
      title: '暂无该功能',
    })
  },
  //修改当前状态
  upType(){
    db.collection('love_user').where({
        _openid:wx.getStorageSync('openId')
      
    }).update({
      data:{
        body_type:this.data.userInfo.body_type?false:true
      },
      success:res=>{
        wx.showToast({
          title: '状态变更成功',
        })
        var type = "userInfo.body_type"
        if(this.data.userInfo.body_type==false){
          this.setData({
            [type]:true
          })
        }else{
          this.setData({
            [type]:false
          })
        }
      }
    })
    console.log(this.data.userInfo.body_type)
  },
  // 获取金币遮罩层
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  // 页面跳转
  gotoPage:e=>{
    wx.navigateTo({
      url: '/pages/details/index',
      })
  },
  gotoNote:e=>{
wx.navigateTo({
  url: '/pages/scrip/index',
})
  },
  getUserProfile(){
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo:true
        })
        this.getOpenId()
      }
    })
  },
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
     wx.setStorageSync('openId', resp.result.openid)
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