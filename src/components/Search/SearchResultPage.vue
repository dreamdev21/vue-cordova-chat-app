<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>戻る</v-ons-back-button>
      </div>
    </v-ons-toolbar>
    <v-ons-list>
      <div v-for="item in users" :key="item.user_id">
        <v-ons-list-item modifier="nodivider">
          <div class="left">
            <img class="list-item__thumbnail" :src="`http://a1333.ml/img/profile/${item.uuid}.jpg`" @click="showProfileImageModalWindow(item.user_id)">
          </div>
          <div class="center" @click="showProfileDetailModalWindow(item.user_id)">
            <span class="list-item__title">{{ item.name }}</span>
            <span class="list-item__title color-gray">{{ `${getGenderString(item.gender)} / ${item.age}歳 / ${item.prefecture}` }}</span>
          </div>
          <div class="right" v-if="item.user_id !== $root.userId">
            <v-ons-icon icon="fa-heart" class="color-pink" @click="sendHeart(item.user_id)" />
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="longdivider" style="background-image: linear-gradient(0deg, #ccc, #ccc 100%) !important;">
          <div class="left" @click="showProfileDetailModalWindow(item.user_id)">
            {{item.comment}}
          </div>
          <div class="center" @click="showProfileDetailModalWindow(item.user_id)">
          </div>
        </v-ons-list-item>
      </div>
    </v-ons-list>

    <v-ons-modal v-if="profileImageModalWindowVisible === true" :visible="profileImageModalWindowVisible" @click="profileImageModalWindowVisible = false">
      <img class="fullsize-profile-image" :src="`http://a1333.ml/img/profile/${modalItem.uuid}.jpg`">
    </v-ons-modal>

    <v-ons-modal v-if="profileDetailModalWindowVisible === true" :visible="profileDetailModalWindowVisible" @click="profileDetailModalWindowVisible = false">
      <h1>{{ modalItem.name }}</h1>
      <div>
        <span>{{ `${getGenderString(modalItem.gender)} / ${modalItem.age}歳 / ${modalItem.prefecture}` }}</span>
      </div>
      <img class="halfsize-profile-image" :src="`http://a1333.ml/img/profile/${modalItem.uuid}.jpg`">
      <div>
        <span>
          {{ modalItem.msg }}
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
      users: [],
      profileImageModalWindowVisible: false,
      profileDetailModalWindowVisible: false,
      modalItem: null
    }
  },
  mounted () {
  },
  methods: {
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
    showProfileImageModalWindow: function (userId) {
      let item = Enumerable.from(this.users)
        .where(x => x.user_id === userId)
        .first()
      this.modalItem = item
      this.profileImageModalWindowVisible = true
    },
    showProfileDetailModalWindow: function (userId) {
      let item = Enumerable.from(this.users)
        .where(x => x.user_id === userId)
        .first()
      this.modalItem = item
      this.profileDetailModalWindowVisible = true
    },
    async sendHeart (id) {
      if (this.$root.userId === null) {
        alert(this.$root.needRegisterMessage)
        this.$root.activeTabIndex = this.$root.UserProfileSettingTabIndex
      } else {
        await this.$root.postMessage(id, 'いいね！')
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
