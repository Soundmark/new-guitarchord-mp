<template>
	<view class="tool">
		<!-- <view class="header">
		</view> -->
		<view class="body">
			<uni-grid :column="2">
				<uni-grid-item>
					<text>节拍器</text>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="popup">
			<metronome></metronome>
		</view>
	</view>
</template>

<script>
	import metronome from '../../components/metronome/index.vue'
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
			metronome
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
.popup{
	position: absolute;
	left: 50%;
	height: 50%;
	transform: translate(-50%,-50%);
	z-index: 10;
}
</style>
