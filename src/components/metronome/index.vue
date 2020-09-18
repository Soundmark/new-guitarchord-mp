<template>
	<view class="metronome">
		<view class="top">
			<view class="tap">
				<button type="default">TAP</button>
				<text>{{bpmChName}}</text>
				<text>{{bpmEnName}}</text>
			</view>
			<view class="display">
				<button type="default">+</button>
				<text>{{bpm}}</text>
				<button type="default">-</button>
			</view>
			<view class="control">
				<view class="slide"></view>
				<view class="slideBtn"></view>
			</view>
		</view>
		<view class="middle">
			<button type="default">jie</button>
			<text> / </text>
			<button type="default">pai</button>
		</view>
		<!-- <view class="bottom">
			
		</view> -->
	</view>
</template>

<script>
	import bpmName from './data.js'
	export default {
		data() {
			return {
				strongPath: '',
				weakPath: '',
				weak1Path: '',
				bpm: 120,
				bpb: {
					jie: 4,
					pai: 4
				},
			}
		},
		components: {
		},
		computed: {
			bpmEnName () {
			  let name
			  bpmName.forEach(item => {
				if (this.bpm >= item.start && this.bpm <= item.end) {
				  name = item.name
				}
			  })
			  return name
			},
			bpmChName () {
			  let name
			  bpmName.forEach(item => {
				if (this.bpm >= item.start && this.bpm <= item.end) {
				  name = item.ch_name
				}
			  })
			  return name
			},
		},
		onLoad() {
		},
		methods: {
		}
	}
</script>

<style lang="scss">
.metronome{
	width: 80vw;
	height: 60vh;
	.top{
		display: flex;
		justify-content: space-around;
	}
	.tap{
		width: 90rpx;
		button{
			padding: 0;
		}
	}
	.display{
		width: 120rpx;
	}
	.control{
		height: 150rpx;
		width: 100rpx;
		position: relative;
		.slide{
			height: 85%;
			width: 6rpx;
			background-color: #808080;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
		.slideBtn{
			height: 15%;
			width: 80rpx;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			background-color: #e6e6e6;
		}
	}
}
</style>
