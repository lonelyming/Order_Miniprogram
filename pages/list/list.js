// pages/list/list.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodlist: [],
    cartlist: [],
    totalprice: 0,
    totalnum: 0,
    mask: false
  },

  getList(key) {
    if (key) {
      this.getSearchList(key)
    }
    else {
      this.getAllList()
    }
  },

  //点击搜索进入列表
  getSearchList(key) {
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
          list.forEach(food => {
            if (!food.num) {
              food.num = 0
            }
          })
          this.data.cartlist.forEach(cart => {
            res.data.forEach(food => {
              if (cart._id == food._id) {
                food.num = cart.num
              }
            })
          })
        }
        this.setData({
          foodlist: res.data,
        })
      })
      .catch(res => {
        console.log('搜索失败', res)
      })
  },

  //获取全部列表
  getAllList() {
    wx.cloud.callFunction({
      name: 'getFoodList',
    })
      .then(res => {
        console.log('菜品列表获取成功,共' + res.result.data.length + '项', res)
        res.result.data.forEach(food => {
          if (!food.num) {
            food.num = 0
          }
        })
        this.data.cartlist.forEach(cart => {
          res.result.data.forEach(food => {
            if (cart._id == food._id) {
              food.num = cart.num
            }
          })
        })
        this.setData({
          foodlist: res.result.data
        })
      })
      .catch(res => {
        console.log('菜品获取失败', res)
      })
  },

  //按钮加
  plus(e) {
    let list = this.data.foodlist
    let id = e.currentTarget.dataset.id
    let cartlist = this.data.cartlist
    let totalprice = this.data.totalprice
    let totalnum = this.data.totalnum
    let flag = false
    list.forEach(food => {
      if (food._id == id) {
        food.num += 1
        totalnum += 1
        totalprice += food.price
        if (cartlist && cartlist.length > 0) {
          for (let i in cartlist) {
            if (cartlist[i]._id == food._id) {
              cartlist[i].num = food.num
              flag = true
              break
            }
          }
          if (!flag) {
            cartlist.push(food)
          }
        }
        else {
          cartlist.push(food)
        }
      }
    })
    this.setData({
      foodlist: list,
      totalnum: totalnum,
      totalprice: totalprice,
      cartlist: cartlist
    })
    wx.setStorageSync('cart', cartlist)
    console.log('添加购物车列表', this.data.cartlist)
  },

  //按钮减
  minus(e) {
    let list = this.data.foodlist
    let id = e.currentTarget.dataset.id
    let cartlist = this.data.cartlist
    let totalprice = this.data.totalprice
    let totalnum = this.data.totalnum
    list.forEach(food => {
      if (food._id == id) {
        if (food.num > 0) {
          food.num -= 1
          totalnum -= 1
          totalprice -= food.price
          for (let j in cartlist) {
            if (cartlist[j]._id == food._id) {
              if (food.num) {
                cartlist[j].num = food.num
              }
              else {
                cartlist.splice(j, 1)
              }
              break
            }
          }
        }
      }
    })
    // list.forEach(food => {
    //   if (food._id == id) {
    //     if (food.num > 0) {
    //       food.num -= 1
    //       totalnum -= 1
    //       totalprice -= food.price
    //     }
    //   }
    // })
    // for (let i in cartlist) {
    //   if (cartlist[i]._id == id) {
    //     if (cartlist[i].num > 0) {
    //       cartlist[i].num -= 1
    //       break
    //     }
    //     else {
    //       cartlist.splice(i, 1)
    //     }
    //   }
    // }
    this.setData({
      foodlist: list,
      totalnum: totalnum,
      totalprice: totalprice,
      cartlist: cartlist
    })
    wx.setStorageSync('cart', cartlist)
    console.log('减少购物车列表', this.data.cartlist)
  },

  //打开购物车
  openCart() {
    if(this.data.mask){
      this.setData({
        mask: false
      })      
    }
    else{
      this.setData({
        mask: true
      })
    }

  },

  //关闭购物车
  closeCart() {
    this.setData({
      mask: false
    })
  },

  //清空购物车
  cleanCart() {
    wx.showModal({
      title: '温馨提示',
      content: '清空购物车不可恢复，是否继续',
      success: (res => {
        if (res.confirm) {
          let foodlist = this.data.foodlist
          foodlist.forEach(food => {
            food.num = 0
          })
          this.setData({
            totalprice: 0,
            totalnum: 0,
            cartlist: [],
            mask: false,
            foodlist: foodlist
          })
          wx.removeStorageSync('cart')
          console.log('清空购物车')
        }
      })
    })
  },

  //消除单个商品
  closeCartItem(e) {
    let id = e.currentTarget.dataset.id
    let list = this.data.foodlist
    let cartlist = this.data.cartlist
    let totalprice = this.data.totalprice
    let totalnum = this.data.totalnum
    list.forEach(food => {
      if (food._id == id) {
        totalprice -= (food.num * food.price)
        totalnum -= food.num
        food.num = 0
      }
    })
    for (let i in cartlist) {
      if (cartlist[i]._id == id) {
        cartlist.splice(i, 1)
        break
      }
    }
    this.setData({
      foodlist: list,
      totalnum: totalnum,
      totalprice: totalprice,
      cartlist: cartlist
    })
    console.log('删除', id)
  },

  //获取缓存数据
  getTotalStorage() {
    let cart = wx.getStorageSync('cart') || []
    let price = 0
    let num = 0
    cart.forEach(food => {
      price += (food.price * food.num)
      num += food.num
    })
    this.setData({
      totalprice: price,
      totalnum: num,
      cartlist: cart
    })
    console.log('加载缓存', cart, price, num)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTotalStorage() //获取缓存
    this.getList(options.key) //加载列表页面
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