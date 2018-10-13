<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item v-for="item in this.$root.privateMessageListItems" :key="item.id">
        <div class="left">
          <img class="list-item__thumbnail" :src="`http://a1333.ml/img/profile/${item.uuid}.jpg`" @click="showProfileImageModalWindow(item.id)">
        </div>
        <div class="center" @click="showMessagePage(item.id)">
          <span class="list-item__title">{{ item.name }}</span>
          <span>{{ item.msg }}</span>
          <span class="list-item__title color-gray">{{ `${getGenderString(item.gender)} / ${item.age}歳 / ${item.prefecture}` }}</span>
        </div>
        <div class="right">
          <v-ons-icon icon="fa-ban" class="color-pink" @click="blockUser(item.id)" />
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-modal v-if="profileImageModalWindowVisible === true" :visible="profileImageModalWindowVisible" @click="profileImageModalWindowVisible = false">
      <img class="fullsize-profile-image" :src="`http://a1333.ml/img/profile/${modalItem.uuid}.jpg`">
    </v-ons-modal>
  </v-ons-page>
</template>

<script>
import MessagePage from './MessagePage'
import Enumerable from 'linq'

export default {
  data () {
    return {
      profileImageModalWindowVisible: false,
      modalItem: null
    }
  },
  async mounted () {
    await this.$root.getPrivateMessageList()

    this.intervalId = setInterval(async () => {
      await this.$root.getPrivateMessageList()
    }, 5000)
  },
  methods: {
    showMessagePage: function (userId) {
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
    },
    getGenderString: function (gender) {
      let genders = [ '男性', '女性', '非公開' ]
      return genders[gender]
    },
    showProfileImageModalWindow: function (id) {
      let item = Enumerable.from(this.$root.privateMessageListItems)
        .where(x => x.id === id)
        .first()
      this.modalItem = item
      this.profileImageModalWindowVisible = true
    },
    showProfileDetailModalWindow: function (id) {
      let item = Enumerable.from(this.$root.privateMessageListItems)
        .where(x => x.id === id)
        .first()
      this.modalItem = item
      this.profileDetailModalWindowVisible = true
    },
    async blockUser (userId) {
      let result = confirm('ブロックしますか？')
      if (result === true) {
        await this.$root.blockUser(userId)
        alert('ブロックしました。')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color-gray {
  color: gray;
}

.fullsize-profile-image {
  width: 200px;
  height: 200px;
}
</style>
