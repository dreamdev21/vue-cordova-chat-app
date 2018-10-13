// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import Vue from 'vue'
import VueOnsen from 'vue-onsenui'
import VueCordova from 'vue-cordova'
import store from './store'
import App from './App'
import VueScrollTo from 'vue-scrollto'
import TabBarPage from './components/TabBarPage'
import TimeLineListPage from './components/TimeLine/TimeLineListPage'
import MessageListPage from './components/Message/MessageListPage'
import MessagePage from './components/Message/MessagePage'
import SearchPage from './components/Search/SearchPage'
import TermsPage from './components/TermsPage'
import lodash from 'lodash'
import VueMoment from 'vue-moment'
import moment from 'moment'
import 'moment/locale/ja'
Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })

Vue.config.productionTip = false

Vue.use(VueOnsen)
Vue.use(VueScrollTo)
Vue.use(VueCordova)
Vue.use(VueMoment, { moment })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data () {
    return {
      userId: null,
      userInfo: {
        uuid: null,
        name: null,
        age: null,
        prefecture: null,
        gender: 0,
        comment: null
      },
      pushToken: null,
      activeTabIndex: 0,
      newMessage: false,
      searchTabIndex: 1, // 定数値
      messageTabIndex: 2, // 定数値
      UserProfileSettingTabIndex: 3, // 定数値
      pageStack: [TabBarPage],
      timeLinePageStack: [TimeLineListPage],
      messagePageStack: [MessageListPage],
      searchPageStack: [SearchPage],
      // TimeLine
      timeLineItems: [],
      userTimeLineItems: [],
      prefectures: [],
      privateMessageListItems: [],
      needRegisterMessage: 'この機能を使うにはプロフ登録が必要です。プロフ登録に移動します。' // 定数値
    }
  },
  async created () {
    let result = await this.getMyInfo()
    if (!result) {
      // ユーザー登録されていないので、利用規約を表示させる
      this.pageStack.push(TermsPage)
    }

    Vue.cordova.on('deviceready', () => {
      document.addEventListener('offline', function () {
        alert('このアプリはネットワーク接続が必要です。')
      }, false)

      FCMPlugin.onTokenRefresh((token) => {
        this.pushToken = token
      })

      FCMPlugin.getToken((token) => {
        this.pushToken = token
      })

      FCMPlugin.onNotification(
        async (data) => {
          if (data.wasTapped) {
            // アプリがバックグラウンドな時にPUSH通知を受け取り、通知をタップした場合
            // alert(JSON.stringify(data))
            switch (data.type) {
              case 'new_message':
                this.newMessage = true
                await this.getPrivateMessageList()

                // メッセージページを表示する
                this.activeTabIndex = this.messageTabIndex
                while (this.messagePageStack.length > 1) {
                  this.messagePageStack.pop()
                }
                this.messagePageStack.push({
                  extends: MessagePage,
                  data () {
                    return {
                      toUserId: parseInt(data.from_user_id)
                    }
                  }
                })
                break
            }
          } else {
            // アプリがアクティブな時にPUSH通知を受け取った場合
            switch (data.type) {
              case 'new_message':
                this.newMessage = true
                await this.getPrivateMessageList()
                break
            }
          }
        },
        (msg) => {
          // alert(`onNotification callback successfully registered: ${msg}`)
        },
        (err) => {
          alert(`Error registering onNotification callback: ${err}`)
        }
      )
    })
  },
  methods: {
    async getPrefectures () {
      let response = await fetch('http://a1333.ml/api/prefecture', { mode: 'cors', credentials: 'include' })
      let json = await response.json()
      this.prefectures = json
    },
    async getTimeLineItems () {
      let res = await fetch('http://a1333.ml/api/timeline', { mode: 'cors', credentials: 'include' })
      let text = await res.text()
      if (text.length !== 0) {
        let json = JSON.parse(text)
        this.timeLineItems = json
      }
    },
    async getUserTimeLineItems (userId) {
      let response = await fetch('http://a1333.ml/api/user_timeline', {
        method: 'post',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(
          {
            id: userId
          })
      })
      let json = await response.json()
      this.userTimeLineItems = json
    },
    async getPrivateMessageList () {
      let res = await fetch('http://a1333.ml/api/private_message_list', { mode: 'cors', credentials: 'include' })
      let text = await res.text()
      if (text.length !== 0) {
        let json = JSON.parse(text)
        this.privateMessageListItems = json
      }
    },
    async postMessage (toUserId, msg) {
      let response = await fetch('http://a1333.ml/api/private_message', {
        method: 'post',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(
          {
            id: toUserId,
            msg: msg
          })
      })
      let json = await response.json()
      return json
    },
    async sendReport (userId, messageId) {
      let response = await fetch('http://a1333.ml/api/report', {
        method: 'post',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(
          {
            id: userId,
            message_id: messageId
          })
      })
      let json = await response.json()
      return json
    },
    async blockUser (userId) {
      let response = await fetch('http://a1333.ml/api/block_user', {
        method: 'post',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(
          {
            id: userId
          })
      })
      let json = await response.json()
      return json
    },
    async setPushToken () {
      if (!this.userId || !this.pushToken) {
        return
      }
      let response = await fetch('http://a1333.ml/api/set_push_token', {
        method: 'post',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(
          {
            id: this.userId,
            push_token: this.pushToken
          })
      })
      let json = await response.json()
      return json
    },
    async getMyInfo () {
      let res = await fetch('http://a1333.ml/api/login', { mode: 'cors', credentials: 'include' })
      let text = await res.text()
      if (text.length === 0) {
        return false
      } else {
        let json = JSON.parse(text)
        this.userId = json.id
        this.userInfo = json
        this.setPushToken()
        return true
      }
    }
  },
  watch: {
    activeTabIndex (x) {
      if (x === this.messageTabIndex) {
        this.newMessage = false
      }
    }
  },
  store,
  template: '<App/>',
  components: { App }
})
