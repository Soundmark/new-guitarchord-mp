<template>
	<view class="list">
		<list-component :current="current" :total="total" :pageSize="30" :list="list" @changePage="changePage"></list-component>
	</view>
</template>

<script>
	import listComponent from '../../components/list-component/index.vue'
	export default {
		data(){
			return {
				list : [],
				current: 1,
				total: 0
			}
		},
		onLoad() {
			this.getList()
		},
		components: {
			listComponent
		},
		methods: {
			getList(){
				let current = (this.current-1)*30
				if(this.$root.$mp.query.type==='favor'){
					if(!this.total){
						this.total = getApp().globalData.favor.length
					}
					this.list = getApp().globalData.favor.slice(current, current+30)
				}else if(this.$root.$mp.query.type==='history'){
					if(!this.total){
						this.total = getApp().globalData.history.length
					}
					this.list = getApp().globalData.history.slice(current, current+30)
				}
			},
			changePage(e){
				this.current = e.current
			}
		}
	}
</script>

<style>
</style>
