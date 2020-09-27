<template>
	<view class="list">
		<uni-list>
			<uni-list-item v-for="(item, index) in list" :key="index" :title="item.song" :note="'歌手:'+item.artist" :to="'/pages/detail/index?link='+item.link"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				list : null
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList(){
				if(this.$root.$mp.query.type==='favor'){
					this.list = getApp().globalData.favor
				}else if(this.$root.$mp.query.type==='history'){
					this.list = getApp().globalData.history
				}
			}
		}
	}
</script>

<style>
</style>
