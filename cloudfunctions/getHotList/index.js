// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('food')
  .where({
    status:"上架"
  })
  .orderBy('sell','desc')
  .limit(5)
  .get()
}