<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>戻る</v-ons-back-button>
      </div>
    </v-ons-toolbar>
    <v-ons-pull-hook :action="loadTimeLineItem" @changestate="state = $event.state">
      <span v-show="state === 'initial'">更新</span>
      <span v-show="state === 'action'">読み込み中</span>
    </v-ons-pull-hook>
    <v-ons-list>
      <div v-for="item in $root.userTimeLineItems" :key="item.id">
        <v-ons-list-item modifier="nodivider">
          <div class="left">
            <img class="list-item__thumbnail" :src="`http://a1333.ml/img/profile/${item.uuid}.jpg`" @click="showProfileDetailModalWindow(item.id)">
          </div>
          <div class="center" @click="showProfileDetailModalWindow(item.id)">
            <span class="list-item__title">{{ item.name }}</span>
            <span class="list-item__title color-gray">{{ `${getGenderString(item.gender)} / ${item.age}歳 / ${item.prefecture}` }}</span>
          </div>
          <div class="right">
            <span>{{ [item.elapsed_seconds, 'seconds'] | duration('humanize', true) }}</span>
            <v-ons-icon v-if="item.user_id === $root.userId" icon="fa-trash" @click="deletePostFromTimeLine(item.id)" />
            <v-ons-icon v-if="item.user_id !== $root.userId" icon="fa-heart" class="color-pink" @click="sendHeart(item.user_id)" />
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="longdivider" style="background-image: linear-gradient(0deg, #ccc, #ccc 100%) !important;">
          <div class="left" @click="showProfileDetailModalWindow(item.id)">
            {{item.msg}}
          </div>
          <div class="center" @click="showProfileDetailModalWindow(item.id)">
          </div>
          <div class="right">
            <v-ons-icon v-if="item.user_id !== $root.userId" icon="fa-exclamation-triangle" class="color-gray" @click="sendReport(item.user_id, item.id)" />
          </div>
        </v-ons-list-item>
      </div>
    </v-ons-list>

    <v-ons-modal v-if="profileDetailModalWindowVisible === true" :visible="profileDetailModalWindowVisible" @click="profileDetailModalWindowVisible = false">
      <h1>{{ modalItem.name }}</h1>
      <div>
        <span>{{ `${getGenderString(modalItem.gender)} / ${modalItem.age}歳 / ${modalItem.prefecture}` }}</span>
      </div>
      <img class="fullsize-profile-image" :src="`http://a1333.ml/img/profile/${modalItem.uuid}.jpg`">
      <div>
        <span>
          {{ modalItem.comment }}
        </span>
      </div>
      <ons-button v-if="$root.userId != modalItem.user_id" @click="showMessagePage(modalItem.user_id)">メッセージを送る</ons-button>
    </v-ons-modal>
  </v-ons-page>
</template>

<script>
import MessagePage from '../Message/MessagePage'
import Enumerable from 'linq'

export default {
  data () {
    return {
      state: 'initial',
      profileDetailModalWindowVisible: false,
      modalItem: null,
      userId: null
    }
  },
  async mounted () {
    await this.$root.getUserTimeLineItems(this.userId)
  },
  methods: {
    async loadTimeLineItem (done) {
      await this.$root.getUserTimeLineItems(this.userId)
      done()
    },
    showMessagePage: function (userId) {
      if (this.$root.userId === null) {
        alert(this.$root.needRegisterMessage)
        this.$root.activeTabIndex = this.$root.UserProfileSettingTabIndex
      } else {
        this.$root.activeTabIndex = this.$root.messageTabIndex
        while (this.$root.messagePageStack.length > 1) {
          this.$root.messagePageStack.pop()
        }
        this.$root.messagePageStack.push({
          extends: MessagePage,
          data () {
            return {
              toUserId: userId
            }
          }
        })
      }
    },
    getGenderString: function (gender) {
      let genders = [ '男性', '女性', '非公開' ]
      return genders[gender]
    },
    showProfileDetailModalWindow: function (id) {
      let item = Enumerable.from(this.$root.userTimeLineItems)
        .where(x => x.id === id)
        .first()
      this.modalItem = item
      this.profileDetailModalWindowVisible = true
    },
    async deletePostFromTimeLine (id) {
      let result = confirm('削除しますか？')
      if (result === true) {
        let response = await fetch('http://a1333.ml/api/delete_post_from_timeline', {
          method: 'post',
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify(
            {
              id: id
            })
        })
        let json = await response.json()
        if (json.success === true) {
          await this.$root.getUserTimeLineItems(this.userId)
          alert('削除しました。')
        }
      }
    },
    async sendHeart (userId) {
      if (this.$root.userId === null) {
        alert(this.$root.needRegisterMessage)
        this.$root.activeTabIndex = this.$root.UserProfileSettingTabIndex
      } else {
        await this.$root.postMessage(userId, 'いいね！')
        alert('「いいね」しました。')
      }
    },
    async sendReport (userId, messageId) {
      if (this.$root.userId === null) {
        alert(this.$root.needRegisterMessage)
        this.$root.activeTabIndex = this.$root.UserProfileSettingTabIndex
      } else {
        let result = confirm('通報しますか？')
        if (result === true) {
          await this.$root.sendReport(userId, messageId)
          alert('通報しました。')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.toolbar-search-icon {
  margin-left: 10px;
}

.color-gray {
  color: gray;
}

.color-pink {
  color: palevioletred;
}

.fullsize-profile-image {
  width: 200px;
  height: 200px;
}

.halfsize-profile-image {
  width: 100px;
  height: 100px;
}
</style>
