<template>
	<view class="content">
		<view class="header">
		</view>
		<view class="body">
			<text>11111</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showList: false,
				searchVal: '',
				currentPage: 1,
				list: []
			}
		},
		components: {
		},
		onLoad() {

		},
		methods: {
			search(){
				this.showList = true
				wx.showLoading({
					title: '加载中'
				})
				wx.cloud.callFunction({
					name: 'getList',
					data: {
					  search: this.searchVal.value,
					  currentPage: this.currentPage
					}
				}).then(res => {
					let dataList = res.result.results.filter(item => item.artist_id)
					// console.log(dataList)
					dataList.forEach(item => {
					  let data = {}
					  data.song = item.song_name
					  data.artist = item.artist_name
					  data.link = item.tab_url
					  data.hot = item.votes
					  this.list.push(data)
					})
					wx.hideLoading()
				}).catch(err => {
					wx.hideLoading()
					wx.showToast({
					  title: '服务器出错，请重试!',
					  icon: 'none',
					  duration: 1500
					})
				})
			},
			cancelSearch(){
				this.showList = false
				this.list = []
			}
		}
	}
</script>

<style lang="scss">
.uni-searchbar{
	width: 500rpx;
}
.right{
	button{
		height: 72rpx;
		font-size: 25rpx;
		line-height: 72rpx;
		padding: 0;
		width: 90rpx;
	}
}
.body{
	width: 100vw;
	min-height: calc(100vh - 100rpx);
}
.uni-searchbar__cancel{
	position: absolute;
	left: -100rpx;
	padding-right: 20rpx;
}
</style>
