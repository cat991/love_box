// pages/setUser/index.js
const common = require('../common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:"",
    userInfo:{},
    dateList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // this.getSex()
    // this.setData({
    //   openId:wx.getStorageSync('openId'),
    //   userInfo:wx.getStorageSync('userInfo').user_info
      
    // })
    
  },
  // 获取男女信息
  getSex:e=>{
    wx.showActionSheet({
      itemList: ['男', '女'],
      success (res) {
        console.log(res.tapIndex)
      },
      fail (res) {
        console.log(res.errMsg)
      }
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