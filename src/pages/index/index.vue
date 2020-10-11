<template>
	<view class="content">
		<view class="header">
			<uni-nav-bar class="search" :fixed="true">
				<view>
					<uni-search-bar placeholder="搜索歌手或歌曲名" radius="50"
					cancelButton="auto" @confirm="search" v-model="searchVal"
					@cancel="cancelSearch"></uni-search-bar>
				</view>
				<view slot="right" class="right">
					<button type="default" @click="search">搜索</button>
				</view>
			</uni-nav-bar>
		</view>
		<view class="body" v-if="showList">
			<list-component :list="list" :showHot="true"
			:current="currentPage" :total="total" :pageSize="1" @changePage="changeListPage"></list-component>
		</view>
		<view class="body" v-else>
			<uni-card class="en" title="热门推荐">
				<list-component :list="recomendList" @changePage="changePage"
				:current="recomendCurrentPage" :total="100" :pageSize="10"></list-component>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import listComponent from '../../components/list-component/index.vue'
	export default {
		data() {
			return {
				showList: false,
				searchVal: '',
				currentPage: 1,
				total: 1,
				recomendCurrentPage: 1,
				list: [],
				recomendList: null,
				recomendSource: null
			}
		},
		components: {
			listComponent
		},
		onLoad() {
			const db = wx.cloud.database()
			const recomend = db.collection('recomend').doc('7fbac6cf5f2d75c30002643256074b6d')
			const that = this
			recomend.get().then(res=>{
				this.recomendSource = res.data.contentList
				this.recomendSource.forEach(item=>{
					item.song = item.song_name
					item.artist = item.artist_name
					item.link = item.tab_url
				})
				this.recomendList = this.recomendSource.slice(0,10)
				wx.cloud.callFunction({
					name: 'getRecomend'
				}).then(res => {})
			})
			//获取用户信息
			uni.getUserInfo({
				provider: 'weixin',
				success:function(e){
					getApp().globalData.userInfo = e.userInfo
				}
			})
			if(!getApp().globalData.openId){
				wx.cloud.callFunction({
					name: 'getOpenid',
				}).then(res=>{
					// console.log(res.result.openId)
					getApp().globalData.openId = res.result.openId
					that.getUserData(res.result.openId)
				}).catch(err=>{
					console.log(err)
				})
			}else{
				that.getUserData(getApp().globalData.openId)
			}
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
					console.log(res.result)
					this.total = res.result.pagination.total
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
					  title: '服务器出错，请点击搜索进行重试!',
					  icon: 'none',
					  duration: 1500
					})
				})
			},
			cancelSearch(){
				this.showList = false
				this.list = []
			},
			getUserData(openId){
				const db = wx.cloud.database()
				db.collection('userData').where({
					_openid: openId
				}).get({
					success: function(res){
						if(!res.data[0]){
							db.collection('userData').add({
								data: {
									favor: [],
									history: []
								}
							})
						}else{
							getApp().globalData.favor = res.data[0].favor
							getApp().globalData.history = res.data[0].history
						}
					}
				})
			},
			changePage(e){
				// console.log(e)
				this.recomendCurrentPage = e.current
				let current = (this.recomendCurrentPage-1)*10
				this.recomendList = this.recomendSource.slice(current, current+10)
			},
			changeListPage(e){
				this.currentPage = e.current
				this.list = []
				this.search()
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
