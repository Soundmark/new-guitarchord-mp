<template>
	<view>
		<view class="metronome">
			<view class="mask" v-if="showMask"></view>
			<view class="cancel"><text @click="close">×</text></view>
			<view class="top">
				<view class="tap">
					<text>{{bpm}}</text>
					<button @click="tap">TAP</button>
				</view>
				<view class="control">
					<button class="decrease" @click="decrease" @touchstart="setBpm('decrease')" @touchend="endSetBpm" @touchmove="endSetBpm">-</button>
					<canvas canvas-id="controller" id="controller" @touchmove="handleCanvasTouchMove" @touchstart="handleCanvasTouchStart" @touchend="handleCanvasTouchEnd"></canvas>
					<button class="add" @click="add" @touchstart="setBpm('add')" @touchend="endSetBpm" @touchmove="endSetBpm">+</button>
				</view>
			</view>
			<view class="middle">
				<button @click="openJiepai('jie')">{{bpb.jie}}</button>
				<text>/</text>
				<button @click="openJiepai('pai')">{{bpb.pai}}</button>
			</view>
			<view class="bottom">
				<button class="play" @click="play">{{playBtn}}</button>
			</view>
			<view class="jiepai" v-if="showJiepai">
				<button v-for="(item, index) in jiepaiArr" :key="index" :class="jiepaiArr.length===2?'pai':'jie'" @click="setJiepai(item)">{{item}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	// import bpmName from './data'
	import Timer from '../../utils/timer.js'
	import './style.scss'
	import {throttle} from '../../utils/debounce&throttle.js'
	
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
				showJiepai: false,
				showMask: false,
				jiepaiArr: [],
				setBpmTimeout: '',
				setBpmInterval: '',
				rect: {},
				tapTime: {
					time1: 0,
					time2: 0
				},
				count: 0,
				timer1: new Timer(),
				timer2: new Timer(),
				ctx: null,
				slidePos: {
					x1: 0,
					x2: 0
				},
				touchPos1: null,
				touchPos2: null,
				touchPeriod: {
					start: 0,
					end: 0
				}
			}
		},
		computed: {
			// bpmEnName() {
			// 	let name
			// 	bpmName.forEach(item => {
			// 		if (this.bpm >= item.start && this.bpm <= item.end) {
			// 			name = item.name
			// 		}
			// 	})
			// 	return name
			// },
			// bpmChName() {
			// 	let name
			// 	bpmName.forEach(item => {
			// 		if (this.bpm >= item.start && this.bpm <= item.end) {
			// 			name = item.ch_name
			// 		}
			// 	})
			// 	return name
			// },
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
						this.timer1.cancelInterval()
						this.timer1.createInterval(this.interval.bind(this), this.timeout)
					}
				}, 500)
			},
			bpb: {
				deep: true,
				handler: function() {
					let that = this
					if (that.playBtn === '停止') {
						this.timer1.cancelInterval()
						this.timer1.createInterval(this.interval.bind(this), this.timeout)
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
			this.ctx = uni.createCanvasContext('controller', this)
			this.$nextTick(() => {
				let query = uni.createSelectorQuery().in(this)
				query.select('#controller').boundingClientRect(data => {
					this.rect = data
					this.slidePos.x2 = -data.width
					this.renderCanvas()
				}).exec()
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
			 * 开始/停止
			 */
			play() {
				// console.log(this.playBtn === '开始')
				if (this.playBtn === '开始') {
					this.playBtn = '停止'
					this.timer1.createInterval(this.interval.bind(this), this.timeout)
				} else if (this.playBtn === '停止') {
					this.playBtn = '开始'
					this.timer1.cancelInterval()
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
			/* 关闭弹窗 */
			close() {
				//   this.showDescription = false
				//   this.showMask = false
				this.$emit('close')
				if (this.playBtn === '停止') {
					this.play()
				}
			},
			/* 
				tap获取bpm
			 */
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
			},
			/* 创建canvas滚轮 */
			renderCanvas(deltaX=0){
				let ctx = this.ctx
				let canvasWidth = this.rect.width, piece = canvasWidth/10, canvasHeight = this.rect.height
				let x1=this.slidePos.x1, x2=this.slidePos.x2, y=0, width=piece, height=canvasHeight
				for(let i=0;i<10;i++){
					ctx.strokeRect(x1+i*piece, y, width, height)
					ctx.strokeRect(x2+i*piece, y, width, height)
				}
				ctx.draw()
				let del = Math.floor(deltaX)
				this.slidePos.x1 = this.limitPos(x1+del, canvasWidth)
				this.slidePos.x2 = this.limitPos(x2+del, canvasWidth)
			},
			limitPos(x, width){
				if(x>width){
					return -width
				}
				if(x<-width){
					return width
				}
				return x
			},
			/* 
				滚轮调整bpm逻辑
			 */
			handleCanvasTouchStart(e){
				// console.log('touchstart', e)
				this.touchPos1 = this.touchPos2 = e.touches[0]
				this.touchPeriod.start = Date.now()
			},
			handleCanvasTouchMove(e){
				let deltaX = e.touches[0].x - this.touchPos1.x
				this.renderCanvas(deltaX)
				this.touchPos1 = e.touches[0]
				throttle(()=>{
					console.log(123)
					if(deltaX>0){
						this.bpm+=1
					}else{
						this.bpm-=1
					}
				}, 100)()
			},
			handleCanvasTouchEnd(e){
				let period = Date.now() - this.touchPeriod.start
				if(period<150){
					this.timer2.cancelInterval()
					let delta = e.changedTouches[0].x - this.touchPos2.x
					let renderCount = Math.round(Math.abs(delta)*100/period)
					this.timer2.createInterval(()=>{
						if(renderCount<=0){
							this.timer2.cancelInterval()
						}
						let deltaX = delta/30
						this.renderCanvas(deltaX)
						renderCount-=1
					}, 16.7)
				}
			}
		}
	}
</script>
