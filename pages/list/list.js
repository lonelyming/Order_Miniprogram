// pages/list/list.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodlist: [],
  },

  getList(key) {
    if (key) {
      db.collection('food')
        .where({
          //模糊搜索
          name: db.RegExp({
            regexp: key,
            options: 'i'//不区分大小写
          })
        }).get()
        .then(res => {
          console.log('搜索成功', res)
          let list = res.data
          if (list && list.length > 0) {
            list.forEach(item => {
              item.num = 0
            })
          }
          list.forEach(food => {
            if (!food.num) {
              food.num = 0
            }
          })
          this.setData({
            foodlist: res.data,
          })
        })
        .catch(res => {
          console.log('搜索失败', res)
        })
    }
    else {
      wx.cloud.callFunction({
        name: 'getFoodList',
      })
        .then(res => {
          console.log('菜品列表获取成功', res)
          res.result.data.forEach(food => {
            if (!food.num) {
              food.num = 0
            }
          })
          this.setData({
            foodlist: res.result.data
          })
        })
        .catch(res => {
          console.log('菜品获取失败', res)
        })
    }
  },

  plus(e) {
    let list = this.data.foodlist
    let id = e.currentTarget.dataset.id
    list.forEach(food => {
      if (food._id == id) {
        food.num += 1
      }
    })
    this.setData({
      foodlist: list
    })
  },

  minus(e) {
    let list = this.data.foodlist
    let id = e.currentTarget.dataset.id
    list.forEach(food => {
      if (food._id == id) {
        if (food.num > 0) {
          food.num -= 1
        }
      }
    })
    this.setData({
      foodlist: list
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.key)
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