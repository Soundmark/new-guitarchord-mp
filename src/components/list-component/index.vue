<template>
	<view class="listComponent">
			<uni-list>
				<uni-list-item v-for="(item,index) in list" :key="index" :title="item.				song" :note="noteContent(item)" 
				 ellipsis="0" link :to="'/pages/detail/index?link='+item.link"></uni-list-item>
			</uni-list>
			<uni-pagination v-if="showPagination" :total="total" :current="current" :pageSize="pageSize" show-icon="true" @change="changePage"></uni-pagination>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array,
			pageSize: Number,
			current: Number,
			total: Number,
			showHot: Boolean
		},
		computed: {
			showPagination(){
				if(this.list.length && this.total>this.pageSize){
					return true
				}
				return false
			}
		},
		methods: {
			noteContent(item){
				if(this.showHot){
					return '歌手:'+item.artist+'   热度:'+item.hot
				}else{
					return '歌手:'+item.artist
				}
			},
			changePage(e){
				// console.log(e)
				this.$emit('changePage', e)
			}
		}
	}
</script>

<style>
</style>
