// pages/loveBox/index.js
const db = wx.cloud.database()
const _ = db.command
var common = require('../common')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabBarText: "恋爱盲盒",
    userInfo: {},
    url: "",
    msgcontent: "暂时没有任何通知", //消息通知
    show: false, //底部弹出层判断
    infoShow: false, //用户展示弹窗
    message: "", // 留言
    boyNumber: 0, //男女盲盒剩余数量
    girlNumber: 0,
    swiperImage: [
      "uGE0h0gHN573aLElBl22L73Hs0LAHa.jpg",
      "agent_door.jpg",
      "1636652250661.png"
    ],
    fileList: [], //图片上传数组
    value: "", //微信号留言
    age: "", //年龄
    sex: "",
    putInfo: {} //展示的用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getOpenId()
    this.setData({
      url: common.url
    })
    console.log(wx.getStorageSync('userInfo')['goid'])
  },
  //获取纸条
  getInfo: function (res) {
    if(wx.getStorageSync('userInfo')['goid'] <= 0){
      Toast('没有更多的金币了哦~')
      return
    }
    var sexs = "男"
    if (res.currentTarget.dataset.sex == "girl") {
      sexs = "女"
    } 
    db.collection('love_record').where({
      // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
      wx_id: _.neq(wx.getStorageSync('openId')),
      sex: _.eq(sexs),
      others:_.eq(null)
    })
    .get({
      success: resp => {
        var rand = common.rand(resp.data.length, 1)
        if (resp.data.length == 0) {
          Toast('没有更多纸条了~');
        } else {
          this.setData({
            putInfo: resp.data[rand-1]
          })
          this.updateUserInfo(resp.data[rand-1]._id,wx.getStorageSync('openId'))
          this.infoShowPopup()
          common.upGold(wx.getStorageSync('openId'),-1,"抽取纸条")
          this.selectUserInfo() 
        }
      
      }
    })

  },
  updateUserInfo:(id,openid)=>{
    console.log('表id:'+id+'当前用户openid'+openid)
    db.collection('love_record').doc(id).update({
      data: {
        others:_.set(openid) 
      },
      success: function(res) {
        console.log('成功了就完了')
      }
    })
  },
  // 信息弹窗层
  infoShowPopup() {
    this.setData({
      infoShow: true
    });
  },

  infoonClose() {
    this.setData({
      infoShow: false
    });
  },
  //投入纸条
  putInfo: function (res) {
    if(wx.getStorageSync('userInfo')['goid'] <= 0){
      Toast('没有更多的金币了哦~')
      return
    }
    this.showPopup()
    if (res.currentTarget.dataset.sex == "girl") {
      this.setData({
        sex: "girl"
      })
    } else {
      this.setData({
        sex: "boy"
      })
    }
  },
  putInfoCloud() {
    if(this.data.message==""||this.data.value==""||this.data.age==""){
      Toast('为了那个他/她，请不要留空哦~')
      return
    }
    var sexs = "男"
    if(this)
    if (this.data.sex == "girl") {
      sexs = "女"
    } else {
      }
      db.collection('love_record').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          wx_id: wx.getStorageSync('openId'),
          user_info: wx.getStorageSync('userInfo')["user_info"],
          content: this.data.message,
          others: null,
          wx: this.data.value,
          age: this.data.age,
          sex: sexs
        },
        success: res => {
          this.onClose()
          Toast.success('成功投入纸条');
          this.setData({
            message: "",
            value: "",
            age: "",
          })
          common.upGold(wx.getStorageSync('openId'),-1,'投入纸条')
          this.selectUserInfo() 
        }
      })
  },

  //双向绑定留言框内容
  onMessage(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      message: event.detail
    })
  },
  onValue(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      value: event.detail
    })
  },
  //弹出显示
  showPopup() {
    this.setData({
      show: true
    });
  },
  //弹出层关闭
  onClose() {
    this.setData({
      show: false
    });
  },
  // 查询是否存在该用户，否则注册
  selectUserInfo: result => {
    db.collection('love_user').where({
        wx_id: _.eq(result)
      })
      .get({
        success: function (res) {
          console.log(res.data.length)
          if (!res.data.length == 0) {
            // 数据添加到全局
            wx.setStorageSync('userInfo', res.data[0])
            wx.setStorageSync('openId', res.data[0].wx_id)
            this.setData({
              userInfo: res.data[0], //保存用户图片昵称
            })
          } else {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }


        }
      })

  },
  //年龄选择器
  onAge(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      age: event.detail
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
      this.selectUserInfo(resp.result.openid)
      this.setData({
        haveGetOpenId: true,
        openId: resp.result.openid
      })
      wx.hideLoading()
    }).catch((e) => {
      this.setData({
        showUploadTip: true
      })
      wx.hideLoading()
    })
  },
  //上传图片
  beforeRead(event) {
    const {
      file,
      callback
    } = event.detail;
    callback(file.type === 'image');
  },
  afterRead(event) {
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: {
        user: 'test'
      },
      success(res) {
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = this.data;
        fileList.push({
          ...file,
          url: res.data
        });
        this.setData({
          fileList
        });
      },
    });
  },
  // 上传图片
  uploadToCloud() {
    wx.cloud.init();
    const {
      fileList
    } = this.data;
    if (!fileList.length) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          const newFileList = data.map(item => ({
            url: item.fileID
          }));
          this.setData({
            cloudPath: data,
            fileList: newFileList
          });
        })
        .catch(e => {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.log(e);
        });
    }
  },
  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url
    });
  },
  // 退出登录函数
  clearOpenId() {
    this.setData({
      haveGetOpenId: false,
      openId: ''
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
