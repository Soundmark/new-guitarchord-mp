const cloud = require('wx-server-sdk')
const axios = require('axios')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
	return event.userInfo
}
