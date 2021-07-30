// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lon: 121.197688,
    lat: 30.320983,
    markers: [{
      id: 0,
      name: "杭州湾中等职业学校",
      address: "浙江省宁波市慈溪市滨海二路",
      latitude: 30.320983,
      longitude: 121.197688,
      phone: '2501902696'
    }]
  },
  clickMap() {
    let marker = this.data.markers[0]
    console.log(marker)
    wx.getLocation({
      type: 'wgs84',
      success: (res => {
        wx.openLocation({
          latitude: marker.latitude,
          longitude: marker.longitude,
          name: "杭州湾中等职业学校",
          address: "浙江省宁波市慈溪市滨海二路",
          scale: 18
        })
      }),
      fail:(res=>{
        console.log("获取位置失败",res)
        wx.showModal({
          title: '需要授权',
          content:'需要授权位置信息才能实现导航,请打开位置信息',
          confirmText:'去设置',
          success:(res=>{
            console.log('弹窗点击',res)
            if(res.confirm){
              wx.openSetting()
            }
          })

        })
      })
    })
  },
  CallPhone(){
    console.log('拨打电话')
    wx.makePhoneCall({
      phoneNumber: this.data.markers[0].phone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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