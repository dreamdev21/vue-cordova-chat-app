<template>
  <v-ons-page id="app">
    <v-ons-tabbar
      swipeable
      position="auto"
      :tabs="tabs"
      :visible="true"
      :index.sync="$root.activeTabIndex">
    </v-ons-tabbar>
  </v-ons-page>
</template>

<script>
import TimeLineNavigatorPage from './TimeLine/TimeLineNavigatorPage'
import MessageNavigatorPage from './Message/MessageNavigatorPage'
import SearchNavigatorPage from './Search/SearchNavigatorPage'
import UserProfileSettingPage from './UserProfileSetting/UserProfileSettingPage'

export default {
  data () {
    return {
      tabs: [
        {
          icon: this.md() ? null : 'fa-home',
          label: 'タイムライン',
          page: TimeLineNavigatorPage,
          key: 'timeLinePage'
        },
        {
          icon: this.md() ? null : 'fa-search',
          label: '検索',
          page: SearchNavigatorPage,
          key: 'searchPage'
        },
        {
          icon: this.md() ? null : 'fa-envelope',
          label: 'メッセージ',
          page: MessageNavigatorPage,
          badge: '',
          key: 'messagePage'
        },
        {
          icon: this.md() ? null : 'fa-cog',
          label: 'プロフ設定',
          page: UserProfileSettingPage,
          key: 'userProfileSettingPage'
        }
      ]
    }
  },
  async mounted () {
    this.intervalId = setInterval(() => {
      if (this.$root.newMessage) {
        this.tabs[this.$root.messageTabIndex].badge = 'NEW'
      } else {
        this.tabs[this.$root.messageTabIndex].badge = ''
      }
    }, 1000)
  },
  methods: {
    md () {
      return this.$ons.platform.isAndroid()
    }
  },
  computed: {
    NewMessage () {
      return this.$root.newMessage ? '!' : ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
