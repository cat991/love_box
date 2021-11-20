// pages/scrip/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const common = require("../common")
const db = wx.cloud.database()
const _ = db.command

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:"",
    dateList:[],       //处理后的数据
    dateLists:[],                 //临时数据
    url:"",
    option1: [
      { text: '投入的纸条', value: 0 },
      { text: '抽到的纸条', value: 1 },
    ],
    option2: [
      { text: '全部纸条', value: 'a' },
      { text: '未被抽取的纸条', value: 'b' },
      { text: '已被抽取的纸条', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
    deletValue:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:common.url,
      openId:wx.getStorageSync('openId')
    })
   this.selectInfo()
  },
  //查询用户纸条
  selectInfo(){
    db.collection('love_record').where({
      // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
     _openid:_.eq(this.data.openId)
    })
    .get({
      success: resp => {
       this.setData({
         dateList:resp.data.reverse()
       })
      }
    })
  },
  // 筛选功能
  onConfirm() {
    this.selectComponent('#item').toggle();
  },

  onSwitch1Change({ detail }) {
    if(detail==0){
      this.setData({ switch1: detail,option2:  [
        { text: '未被抽取的纸条', value: 'b' },
        { text: '已被抽取的纸条', value: 'c' },
      ],value2:"b"
      
    })
    }else{
      this.setData({ switch1: detail,option2:  [
        { text: '全部纸条', value: 'a' },
      ],value2:"a"})
    }
    console.log(this.data.switch1)
  },

  onSwitch2Change({ detail }) {
    this.setData({ switch2: detail });
    console.log(this.data.switch2)
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
          this.delet(this.data.deletValue)
          instance.close();
        }).catch(()=>{
        console.log('咱也不敢说咱也不敢问')
        instance.close();
        });
        break;
    }
  },
    //删除纸条数据
    delet(deletValue){
      wx.showLoading({
        title: '删除中',
      })
      console.log(deletValue)
      db.collection('love_record').doc(deletValue).remove({
        success: res=> {

          console.log('删除成功')
          Toast.success('成功删除')
          wx.hideLoading()
          this.selectInfo()
        },
        fail:r => {
          console.log('删除失败')
          Toast.fail('删除失败')
          wx.hideLoading()
        }
      })
    },
  //设置要删除的id
  setValue(value){
    this.setData({
      deletValue:value.target.dataset.value
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