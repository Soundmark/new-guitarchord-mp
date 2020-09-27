const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const recomend = db.collection('recomend').doc('7fbac6cf5f2d75c30002643256074b6d')
  let res,data='success'
  let url = 'https://www.ultimate-guitar.com/top/tabs?order=hitsdailygroup_desc&type=chords'
  res = await axios.get(url)
  let $ = cheerio.load(res.data)
  let storeJson = $('.js-store').attr('data-content')
  let storeData = JSON.parse(storeJson)
  // await recomend.get().then(res=>{
	 //  if(event.type==='recomend'){
		// data = res.data.contentList.splice(0,6)
	 //  }else{
		//   data = res.data.contentList
	 //  }
  // })
  await recomend.update({
	  data: {
		  contentList: storeData.store.page.data.tabs
	  }
  })
  return data
}
