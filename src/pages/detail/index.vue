<template>
	<view class="detail" v-if="showTitle">
		<view class="header">
			<view class="left">
				<text>{{song}}</text>
				<text class="artist">歌手：{{artist}}</text>
				<text class="capo" v-if="capo">Capo：{{capo}}</text>
			</view>
			<view class="right">
				<uni-fav :checked="checked" @click="setFavor" :circle="true"></uni-fav>
			</view>
		</view>
		<view class="body">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
	<view class="retry" v-else-if="showRetry">
		<button @click="load">点击重试</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				artist: '',
				song: '',
				capo: '',
				showTitle: false,
				checked: false,
				showRetry: false,
				listItem: null
			}
		},
		components: {
		},
		onLoad() {
			this.load()
			let url = this.$root.$mp.query.link
			let favor = getApp().globalData.favor
			if(favor.find(item=>item.link===url)){
				this.checked = true
			}
		},
		methods: {
			load(){
				this.showRetry = false
				wx.showLoading({
				  title: '加载中'
				})
				let url = this.$root.$mp.query.link
				wx.cloud.callFunction({
				  name: 'getChord',
				  data: {
					url
				  }
				}).then(res => {
				  let chord = res.result.tab_view.wiki_tab.content
				  chord = chord.replace(/\[ch\]/g, '<b style="background-color:#a4a4a4;">').replace(/\[\/ch\]/g, '</b>').replace(/\[tab\]/g, '<div>').replace(/\[\/tab\]/g, '</div>')
				  this.content = '<pre style="white-space:pre-wrap">' + chord + '</pre>'
				  this.artist = res.result.tab.artist_name
				  this.song = res.result.tab.song_name
				  if (res.result.tab_view.meta.capo) {
					this.capo = res.result.tab_view.meta.capo + 'st fret'
				  }
				  this.showTitle = true
				  wx.hideLoading()
				  this.listItem = {
					  song: this.song,
					  artist: this.artist,
					  link: this.$root.$mp.query.link
				  }
				  this.addHistory(this.listItem)
				}).catch(err=>{
					wx.hideLoading()
					this.showRetry = true
					wx.showToast({
						title: '加载失败，请重试!',
						icon: 'none',
						duration: 1500
					})
				})
			},
			addHistory(item){
				let history = getApp().globalData.history
				let index = history.findIndex(ele=>ele.link===item.link)
				if(index!==-1){
					history.splice(index, 1)
				}else{
					if(history.length===50){
						history.pop()
					}
				}
				history.unshift(item)
			},
			setFavor(){
				let favor = getApp().globalData.favor
				let url = this.$root.$mp.query.link
				if(this.checked){
					let index = favor.findIndex(item=>item.link===url)
					favor.splice(index, 1)
				}else{
					favor.unshift(this.listItem)
				}
				this.checked = !this.checked
			}
		}
	}
</script>

<style lang="scss">
.detail{
	.header{
		border-bottom: 1px solid #e6e6e6;
		margin-bottom: 10rpx;
		padding: 5rpx 0 5rpx 5rpx;
		.left{
			display: inline-block;
			width: 80%;
			vertical-align: middle;
			text{
				display: block;
			}
			.artist,.capo{
				font-size: 22rpx;
			}
		}
		.right{
			display: inline-block;
			width: 20%;
		}
	}
}
.retry{
	width: 100vw;
	height: 100vh;
	position: relative;
	button{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
