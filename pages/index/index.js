// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
  },
  // 事件处理函数
  getPoetry:function(e){
    let i = e.currentTarget.dataset['index']
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.back_url+"static/poetry"+i+".wav"
  }
})
