<template>
	<view>
		<view class="metronome">
			<view class="mask" v-if="showMask"></view>
			<view class="cancel"><text @click="close">×</text></view>
			<view class="top">
				<view class="tap">
					<button @click="tap">TAP</button>
					<text>{{bpmEnName}}</text><br>
					<text>{{bpmChName}}</text>
				</view>
				<view class="center">
					<button class="add" @click="add" @touchstart="setBpm('add')" @touchend="endSetBpm" @touchmove="endSetBpm">+</button>
					<text>{{bpm}}</text>
					<button class="decrease" @click="decrease" @touchstart="setBpm('decrease')" @touchend="endSetBpm" @touchmove="endSetBpm">-</button>
				</view>
				<view class="control">
					<view class="slide"></view>
					<view class="slideBtn" @touchmove="slideBpm" :style="{bottom:slideBtnTop+'%'}">≡</view>
				</view>
			</view>
			<view class="middle">
				<button @click="openJiepai('jie')">{{bpb.jie}}</button>
				<text>/</text>
				<button @click="openJiepai('pai')">{{bpb.pai}}</button>
			</view>
			<view class="bottom">
				<button class="play" @click="play">{{playBtn}}</button>
				<!-- <a @click="openDescription">节拍器说明</a> -->
			</view>
			<!-- <view class="description" v-if="showDescription">
      <text @click="close">×</text>
      <p>
        1.速率BPM：上部正中位置的数字代表速率，表示一分钟的拍子数，+-号分别能加减一，右侧滑块可以通过滑动改变速率，左下侧为当前速率的名词。<br>
        2.TAP：通过连续点击两次TAP可以捕获点击的速率。<br>
        3.节拍BPB：中部两个数字左侧表示一节的拍子数，右侧表示组成拍子的音符（4表示四分音符，占一拍，8表示八分音符，占二分之一拍）。
      </p>
    </view> -->
			<view class="jiepai" v-if="showJiepai">
				<button v-for="(item, index) in jiepaiArr" :key="index" :class="jiepaiArr.length===2?'pai':'jie'" @click="setJiepai(item)">{{item}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import bpmName from './data'
	import {
		createInterval,
		cancelInterval
	} from '../../utils/timer.js'
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
				playBtn: '开始',
				// interval: '',
				showDescription: false,
				showJiepai: false,
				showMask: false,
				jiepaiArr: [],
				setBpmTimeout: '',
				setBpmInterval: '',
				rect: {},
				slideBtnTop: 36.6,
				tapTime: {
					time1: 0,
					time2: 0
				},
				count: 0
			}
		},
		computed: {
			bpmEnName() {
				let name
				bpmName.forEach(item => {
					if (this.bpm >= item.start && this.bpm <= item.end) {
						name = item.name
					}
				})
				return name
			},
			bpmChName() {
				let name
				bpmName.forEach(item => {
					if (this.bpm >= item.start && this.bpm <= item.end) {
						name = item.ch_name
					}
				})
				return name
			},
			timeout() {
				return 1000 * 60 * 4 / Number(this.bpm) / Number(this.bpb.pai)
			}
		},
		watch: {
			timeout: function() {
				console.log('timeout changed')
				let that = this
				setTimeout(() => {
					if (that.playBtn === '停止') {
						// clearInterval(that.interval)
						// that.createInterval()
						cancelInterval()
						createInterval(this.interval.bind(this), this.timeout)
					}
				}, 500)
			},
			bpb: {
				deep: true,
				handler: function() {
					let that = this
					if (that.playBtn === '停止') {
						cancelInterval()
						createInterval(this.interval.bind(this), this.timeout)
					}
				}
			}
		},
		created() {
			let that = this
			wx.cloud.downloadFile({
				fileID: 'cloud://guitar-chord-inxmz.6775-guitar-chord-inxmz-1302192820/metronome/strong.mp3',
				success: (res) => {
					that.strongPath = res.tempFilePath
				}
			})
			wx.cloud.downloadFile({
				fileID: 'cloud://guitar-chord-inxmz.6775-guitar-chord-inxmz-1302192820/metronome/weak.mp3',
				success: (res) => {
					that.weakPath = res.tempFilePath
				}
			})
			wx.cloud.downloadFile({
				fileID: 'cloud://guitar-chord-inxmz.6775-guitar-chord-inxmz-1302192820/metronome/weak1.mp3',
				success: (res) => {
					that.weak1Path = res.tempFilePath
				}
			})
		},
		mounted() {
			wx.showShareMenu()
			let that = this
			this.$nextTick(() => {
				let query = uni.createSelectorQuery().in(this)
				query.select('.slideBtn').boundingClientRect(data => {
					this.rect = data
				}).exec()
				//   query.exec(res => {
				//     that.rect = res[0]
				//     console.log(res)
				//   })
			})
			this.audioContext = wx.createInnerAudioContext()
		},
		methods: {
			/**
			 * bpm增减处理
			 */
			add() {
				if (this.bpm < 240) {
					this.bpm += 1
					this.slideBtnTop = 85 * (this.bpm - 20) / 220
				}
			},
			decrease() {
				if (this.bpm > 20) {
					this.bpm -= 1
					this.slideBtnTop = 85 * (this.bpm - 20) / 220
				}
			},
			/**
			 * bpm长按增减处理
			 */
			setBpm(opt) {
				let that = this
				this.setBpmTimeout = setTimeout(() => {
					that.setBpmInterval = setInterval(() => {
						if (opt === 'add') {
							if(that.bpm<240){
								that.bpm += 1
							}
						} else {
							if(that.bpm>20){
								that.bpm -= 1
							}
						}
						this.slideBtnTop = 85 * (this.bpm - 20) / 220
					}, 150)
				}, 1000)
			},
			endSetBpm() {
				clearTimeout(this.setBpmTimeout)
				if (this.setBpmInterval) {
					clearInterval(this.setBpmInterval)
				}
			},
			/**
			 * bpm滑动增减处理
			 */
			slideBpm(e) {
				console.log(e, this.rect)
				if (e.touches[0].clientX > this.rect.left && e.touches[0].clientX < this.rect.right && e.touches[0].clientY <= 221 &&
					e.touches[0].clientY >= 134) {
						// console.log(this.slideBtnTop)
						if (this.slideBtnTop >= 0 && this.slideBtnTop <= 85) {
							// console.log(123)
							this.slideBtnTop = 18700 / 86 - 85 * e.touches[0].clientY / 86
							this.slideBtnTop = Math.ceil(this.slideBtnTop)
							this.bpm = Math.ceil(220 * this.slideBtnTop / 85 + 20)
						}
				}
			},
			/**
			 * 设置节拍
			 */
			openJiepai(opt) {
				let arr = []
				if (opt === 'jie') {
					for (let i = 1; i <= 16; i++) {
						arr.push(i)
					}
				} else if (opt === 'pai') {
					arr = [4, 8]
				}
				this.jiepaiArr = arr
				this.showJiepai = true
				this.showMask = true
			},
			setJiepai(item) {
				if (this.jiepaiArr.length === 2) {
					this.bpb.pai = item
				} else {
					this.bpb.jie = item
				}
				this.showJiepai = false
				this.showMask = false
			},
			/**
			 * 打开/关闭说明
			 */
			openDescription() {
				this.showDescription = true
				this.showMask = true
			},
			close() {
				//   this.showDescription = false
				//   this.showMask = false
				this.$emit('close')
				if (this.playBtn === '停止') {
					this.play()
				}
			},
			/**
			 * 开始/停止
			 */
			play() {
				console.log(this.playBtn === '开始')
				if (this.playBtn === '开始') {
					this.playBtn = '停止'
					// this.createInterval()
					createInterval(this.interval.bind(this), this.timeout)
				} else if (this.playBtn === '停止') {
					this.playBtn = '开始'
					// clearInterval(this.interval)
					cancelInterval()
				}
			},
			interval() {
				if (this.count % this.bpb.jie === 0) {
					this.audioContext.src = this.strongPath
					this.audioContext.play()
				} else {
					if (this.audioContext.src === this.weak1Path || this.audioContext.src === this.strongPath) {
						this.audioContext.src = this.weakPath
					} else {
						this.audioContext.src = this.weak1Path
					}
					this.audioContext.play()
				}
				this.count++
			},
			tap() {
				if (!this.tapTime.time1) {
					this.tapTime.time1 = Date.now()
					console.log(1)
				} else {
					this.tapTime.time2 = Date.now()
					let daltaTime = this.tapTime.time2 - this.tapTime.time1
					let newBpm = Math.round(60000 / daltaTime)
					newBpm = Math.max(newBpm, 20)
					newBpm = Math.min(newBpm, 240)
					this.bpm = newBpm
					this.tapTime.time1 = 0
				}
			}
		}
	}
</script>

<style lang='scss'>
	.metronome {
		height: 70vh;
		width: 500rpx;
		background-color: #e6e6e6;
		position: relative;
		border: 1px solid #e6e6e6;
		border-radius: 5rpx;
		/* box-shadow: 0 0 5rpx 5rpx rgba(0,0,0,0.6); */
	}

	.cancel {
		text-align: right;
		margin-top: 10rpx;

		text {
			padding: 10rpx;
		}
	}

	.top {
		padding-top: 100rpx;
		height: 200rpx;
		text-align: center;

		.tap {
			width: 120rpx;
			height: 200rpx;
			display: inline-block;
			vertical-align: middle;

			button {
				width: 80rpx;
				height: 60rpx;
				margin-bottom: 30rpx;
				padding: 0;
				line-height: 60rpx;
			}
		}

		.center {
			height: 200rpx;
			width: 100rpx;
			vertical-align: middle;
			display: inline-block;
			margin: 0 15rpx;

			.add,
			.decrease {
				height: 40rpx;
				line-height: 40rpx;
			}

			text {
				display: inline-block;
				font-size: 30rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
		}

		.control {
			display: inline-block;
			vertical-align: middle;
			text-align: center;
			height: 200rpx;
			width: 120rpx;
			position: relative;

			.slide {
				height: 85%;
				width: 3rpx;
				background-color: #000;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}

			.slideBtn {
				position: absolute;
				width: 80rpx;
				height: 15%;
				background-color: #fff;
				border-radius: 5rpx;
				left: 50%;
				transform: translateX(-50%);
				line-height: 30rpx;
				font-size: 20rpx;
			}
		}
	}

	.middle {
		text-align: center;
		height: 60rpx;
		margin-top: 20rpx;

		button {
			display: inline-block;
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			padding: 0;
			vertical-align: middle;
			margin: 0 10rpx;
		}

		text {
			display: inline-block;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 20rpx;
			vertical-align: middle;
		}
	}

	.bottom {
		text-align: center;
		margin-top: 20rpx;

		button {
			width: 120rpx;
			height: 60rpx;
			padding: 0;
			line-height: 60rpx;
		}

		a {
			font-size: 10rpx;
			color: blue;
			padding-top: 5rpx;
			width: 80rpx;
			margin: 0 auto;
		}
	}

	.description {
		z-index: 100;
		position: absolute;
		width: 220rpx;
		border-radius: 5rpx;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		box-shadow: 1rpx 1rpx 5rpx 1rpx #000;

		text {
			float: right;
			padding: 0 5rpx;
		}

		p {
			line-height: 25rpx;
			padding: 5rpx 5rpx;
			margin-top: 15rpx
		}
	}

	.jiepai {
		z-index: 100;
		border-radius: 5rpx;
		position: absolute;
		width: 200rpx;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		background-color: #e6e6e6;
		box-shadow: 0rpx 0rpx 5rpx 1rpx #000;
		padding-top: 4rpx;

		button {
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			padding: 0;
			display: inline-block;
			margin: 0 2rpx;
		}

		.pai {
			width: 90rpx;
		}
	}

	.mask {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(209, 208, 208, 0.4);
		z-index: 1;
	}

	.mask::after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		background: inherit;
		filter: blur(5rpx);
		z-index: 2;
	}
</style>
