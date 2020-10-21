<template>
	<view class="tool">
		<!-- <view class="header">
		</view> -->
		<view class="body">
			<uni-grid :column="2" @change="setPopup">
				<uni-grid-item>
					<image src="../../static/icon/metronome-select.png"></image>
					<text>节拍器</text>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="popup">
			<metronome v-if="show==='metronome'" @close="closePopup"></metronome>
		</view>
	</view>
</template>

<script>
	import metronome from '../../components/metronome/index.vue'
	export default {
		data() {
			return {
				show: '',
				searchVal: '',
				currentPage: 1,
				list: []
			}
		},
		components: {
			metronome
		},
		onShareAppMessage(res) {
			return {
				title: 'TXT吉他谱搜索器',
				path: '/pages/index/index'
			}
		},
		onShareTimeline() {
			return {
				title: 'TXT吉他谱搜索器',
			}
		},
		methods: {
			setPopup({detail}){
				if(detail.index===0){
				this.show = 'metronome'
				}
			},
			closePopup(){
				this.show = ''
			}
		}
	}
</script>

<style lang="scss">
.popup{
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	z-index: 10;
}
.body{
	image{
		width: 200rpx;
		height: 200rpx;
		position: relative;
		left: 50%;
		top: 45%;
		transform: translate(-50%, -50%);
	}
	text{
		position: relative;
		text-align: center;
		top: 20%;
	}
}
</style>
