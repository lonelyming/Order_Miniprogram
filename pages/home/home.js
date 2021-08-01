// pages/home/home.js
let search_word = ''
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [
      { picUrl: '/images/banner1.jpg' },
      { picUrl: '/images/banner2.jpg' },
      { picUrl: '/images/banner3.jpg' }
    ],
    hotlist: []

  },

  //获取轮播图地址
  getBanner() {
    db.collection('banner').get()
      .then(res => {
        console.log(res.data)
        this.setData({
          banner: res.data
        })
      })
      .catch(res => {
        console.log(res)
      })
  },

  //得到搜索框中的值
  getInput(e) {
    search_word = e.detail.value
  },

  //触发搜索事件
  goSearch() {
    if (search_word && search_word.length > 0) {
      console.log('搜索跳转', search_word)
      wx.navigateTo({
        url: '/pages/list/list?key=' + search_word,
      })
    }
    else {
      console.log('直接跳转')
      this.golist()
    }
  },

  //触发去菜单页
  golist() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },

  //触发去排队页
  goqueue() {
    wx.navigateTo({
      url: '/pages/queue/queue',
    })
  },

  //触发去地址页
  goaddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  //获取热门推荐
  getHotList() {
    wx.cloud.callFunction({
      name: 'getHotList',
    })
      .then(res => {
        console.log('热门菜品列表获取成功', res)
        this.setData({
          hotlist: res.result.data
        })
      })
      .catch(res => {
        console.log('热门菜品获取失败', res)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanner()
    this.getHotList()
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