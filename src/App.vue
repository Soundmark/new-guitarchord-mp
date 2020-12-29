<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
			this.saveData()
		},
		globalData: {
			userInfo: null,
			openId: undefined,
			favor: [],
			history: []
		},
		methods: {
			saveData(){
				const db = wx.cloud.database()
				db.collection('userData').where({
					_openid: this.globalData.openId
				}).update({
					data: {
						favor: this.globalData.favor,
						history: this.globalData.history
					}
				}).catch(err=>console.log(err))
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
