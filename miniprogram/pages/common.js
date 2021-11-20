const db = wx.cloud.database()
const _ = db.command
function rand(max,min){
   return Math.floor(Math.random() * (max - min) ) + min
}
function getTime(){
   var date = new Date();
   //年
   var Y = date.getFullYear();
   //月
   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
   //日
   var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
   //时
   var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();;
   //分
   var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();;
   //秒
   var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();;
   // 日期
   var dta = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  // 赋值
  return dta
}
function upGold(openid,number,text){
   db.collection('love_user').where({
      _openid:openid
   }).update({
      data: {
        goid: _.inc(number)
      },
      success: function(res) {
         console.log('自增')
         db.collection('love_gold').add({
            data: {
             number:number,
             text:text,
             formatDate: getTime()
            },
            success: function(resp) {
              
            }
          })
      }
    })
}
const url = "/images/"    //开发者模式
//生产环境
// const url = "cloud://env-1gpwd13dd723c683.656e-env-1gpwd13dd723c683-1308225072/images/"

module.exports.rand=rand
module.exports.url = url
module.exports.upGold=upGold