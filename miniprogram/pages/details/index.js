// pages/details/index.js
const db = wx.cloud.database()
const _ = db.command
const commmon = require('../common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      dateList:[],
      userInfo:"",
      openId:"",
      show:false,
      url:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:commmon.url
    })
    this.selcetGoid()
  },
  // 查询金币信息
  selcetGoid(){
    db.collection('love_gold').where({
      _openid:wx.getStorageSync('openId')
    }).get({
      success:res=>{
        console.log(res)
        this.setData({
          dateList:res.data.reverse()
        })
      }
    })
  },
  // 滑动销毁纸条
  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {

          console.log('销毁数据')
          instance.close();
        }).catch(()=>{
        console.log('咱也不敢说咱也不敢问')
        instance.close();
        });
        break;
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

  }
})