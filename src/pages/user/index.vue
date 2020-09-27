<template>
	<view class="content">
		<view class="header">
			<view v-if="userInfo">
				<uni-list>
					<uni-list-chat :title="userInfo.nickName" :avatar="userInfo.avatarUrl"></uni-list-chat>
				</uni-list>
			</view>
			<view v-else>
				<button open-type="getUserInfo" @getuserinfo="onGotUserInfo">登录</button>
			</view>
		</view>
		<view class="body">
			<uni-list>
				<uni-list-item title="我的收藏" to="/pages/list/index?type=favor"></uni-list-item>
				<uni-list-item title="浏览历史" to="/pages/list/index?type=history"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
				openId: ''
			}
		},
		components: {
		},
		onLoad() {
			this.userInfo = getApp().globalData.userInfo
			this.openId = getApp().globalData.openId
		},
		methods: {
			onGotUserInfo(e){
				// console.log(e)
				getApp().globalData.userInfo = e.detail.userInfo
				this.userInfo = e.detail.userInfo
				if(!getApp().globalData.openId){
					wx.cloud.callFunction({
						name: 'getOpenid',
					}).then(res=>{
						getApp().globalData.openId = res.result.openId
					}).catch(err=>{
						console.log(err)
					})
				}
			},
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
