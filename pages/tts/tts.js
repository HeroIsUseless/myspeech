// tts.js
const util = require('../../utils/util.js')
const recorderManager = wx.getRecorderManager()
const tone_options = {
  duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
  sampleRate: 16000, //采样率
  numberOfChannels: 1, //录音通道数
  encodeBitRate: 96000, //编码码率
  format: 'mp3', //音频格式，有效值 aac/mp3
  frameSize: 25, //指定帧大小，单位 KB
}
const app = getApp()
Page({
  data: {
    text: ""
  },
  onLoad() {},
  start: function () {
    recorderManager.start(tone_options); //开始录音
    recorderManager.onStart(() => {wx.showToast({title: "开始录制", icon: 'succes', duration: 1000, mask: true})});
    recorderManager.onError((res) => {console.log(res);}) //错误回调
  },
  stop: function () {
    recorderManager.stop(); //结束录音  
    recorderManager.onStop((res) => {
      wx.uploadFile({ //上传录音
        url: app.globalData.back_url+'tone/', // 音色wav的上传
        filePath: res.tempFilePath,
        name: 'tone', //后台要绑定的名称
        header: {"Content-Type": "multipart/form-data"},
        success: function (reponse) {
          console.log(res);
          wx.showToast({title: '处理完成', icon: 'success', duration: 2000})
        },
        fail: function (reponse) {console.log("录音处理失败");}
      })
    })
  },
  listenerInput(e) {this.data.text = e.detail.value;},
  sendText() {
    if (this.data.text === "") {
      wx.showToast({title: "请输入文本！",icon: 'loading',duration: 1000,mask: true})
    }
    else{
      // 在这里上传文本并处理合成wav
      wx.showToast({title: "正在上传",icon: 'loading',duration: 1000,mask: true})
      wx.request({
        url: app.globalData.back_url+"text/",
        data: {text: this.data.text},
        header: {'content-type': 'application/json'},
        success: (res) => {wx.showToast({title: "合成成功！",icon: 'success',duration: 1000,mask: true})},
        fail: function (reponse) {wx.showToast({title: "合成失败！",icon: 'loading',duration: 1000,mask: true})}
      })
    }
  },
  playWav: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.back_url+"static/voice.wav"
  },
  playToneMp3: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.back_url+"static/tone.mp3"
  },
  playToneWav: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.back_url+"static/tone.wav"
  },
  post_test: function () { // 最简单post测试，不用管
    wx.request({
      url: 'http://heroisuseless.cn:8848/text/',
      data: {
        var: "post 1234"
      },
      success: res => {
        if (res.statusCode == 200) {
          // 返回消息的处理
          console.log(res)
          wx.showToast({
            title: res.data,
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          // this.setData({
          //   result: res.data
          // })
        }
      }
    })
  },
})