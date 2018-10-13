<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>戻る</v-ons-back-button>
      </div>
      <div class="center">
        {{ toUserName }}
      </div>
    </v-ons-toolbar>
    <v-ons-list id="message-list">
      <v-ons-list-item v-for="item in messages" :key="item.id">
        <div :class="{right: $root.userId === item.from_user_id, left: $root.userId !== item.from_user_id}">
          <span>{{ item.msg }}</span>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <v-ons-bottom-toolbar class="bottom-toolbar">
      <textarea class="textarea" v-model="msg" style="width: 80%"></textarea>
      <ons-button class="send-button" :disabled="sendButtonDisabled" @click="postMessage">送信</ons-button>
    </v-ons-bottom-toolbar>
  </v-ons-page>
</template>

<script>
import Enumerable from 'linq'

export default {
  data () {
    return {
      toUserId: null,
      toUserName: null,
      msg: '',
      messages: [],
      intervalId: null,
      sendButtonDisabled: false
    }
  },
  async mounted () {
    await this.getMessages()
    await this.$root.getPrivateMessageList()
    this.toUserName = this.getUserName()

    this.intervalId = setInterval(async () => {
      await this.getMessages()
    }, 1000)
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  methods: {
    async sleep (msec) {
      return new Promise(resolve => setTimeout(resolve, msec))
    },
    async getMessages () {
      let lastId = 0
      if (this.messages.length > 0) {
        lastId = _.last(this.messages).id
      }
      let res = await fetch(`http://a1333.ml/api/private_message?id=${this.toUserId}&last_id=${lastId}`, { mode: 'cors', credentials: 'include' })
      let text = await res.text()
      if (text.length !== 0) {
        let json = JSON.parse(text)
        if (json.length > 0) {
          for (let i = 0; i < json.length; i++) {
            this.messages.push(json[i])
          }

          // 一番下にスクロールさせる
          await this.sleep(100)
          let messageListDom = this.$el.querySelector('#message-list')
          messageListDom.parentElement.scrollTop = messageListDom.parentElement.scrollHeight
        }
      }
    },
    async postMessage () {
      this.sendButtonDisabled = true

      let json = await this.$root.postMessage(this.toUserId, this.msg)

      if (json.success) {
        this.msg = ''
        // await this.getMessages()
      }

      this.sendButtonDisabled = false
    },
    getGenderString: function (gender) {
      let genders = [ '男性', '女性', '非公開' ]
      return genders[gender]
    },
    getUserName () {
      let users = Enumerable.from(this.$root.privateMessageListItems)
        .where(x => x.id === this.toUserId)

      return (users.count() > 0) ? users.first().name : '11'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bottom-toolbar {
  height: initial;
}

.msg {
  width: 100%;
  border: solid silver;
  border-width: 1px;
  border-radius:10px;
  box-shadow: none;
}
 
.msg:focus {
  outline: none;
}
</style>
