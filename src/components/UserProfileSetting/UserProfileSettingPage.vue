<template>
  <ons-page>
    <form id="form1">
      <div>
        <vueCropper
          ref="cropper"
          :img="vueCropperOption.img"
          :outputSize="vueCropperOption.size"
          :outputType="vueCropperOption.outputType"
          :autoCrop="vueCropperOption.autoCrop"
          :autoCropWidth="vueCropperOption.autoCropWidth"
          :autoCropHeight="vueCropperOption.autoCropHeight"
          :fixed="vueCropperOption.fixed"
          :fixedNumber="vueCropperOption.fixedNumber"
          style="height: 300px"
        ></vueCropper>
        <label class="btn" for="image"><v-ons-button style="margin: 6px 0">プロフィール画像アップロード</v-ons-button></label>
        <v-ons-button @click="changeScale(1)">+</v-ons-button>
        <v-ons-button @click="changeScale(-1)">-</v-ons-button>
        
        <input type="file" id="image" accept="image/*" style="position:absolute; clip:rect(0 0 0 0);" @change="chooseImg($event)">
      </div>

      <table>
        <tr>
          <td><label for="name">ニックネーム</label></td>
          <td><v-ons-input id="name" name="name" modifier="underbar" v-model="name" /></td>
        <tr>
          <td><label for="age">年齢</label></td>
          <td><v-ons-input id="age" name="age" type="number" modifier="underbar" v-model="age"/></td>
        </tr>
        <tr>
          <td><label for="prefecture">都道府県</label></td>
          <td>
            <v-ons-select id="prefecture" name="prefecture" v-model="prefecture">
              <option v-for="x in $root.prefectures" :key="x.id" :value="x.id">{{x.name}}</option>
            </v-ons-select>
          </td>
        </tr>
        <tr>
          <td><label for="gender">性別</label></td>
          <td>
            <v-ons-select id="gender" name="gender" v-model="gender">
              <option value="0">男性</option>
              <option value="1">女性</option>
              <option value="2">非公開</option>
            </v-ons-select>
          </td>
        </tr>
        <tr>
          <td><label for="comment">ひとこと</label></td>
          <td><v-ons-input id="comment" name="comment" modifier="underbar" maxlength=100 v-model="comment" /></td>
        </tr>
      </table>

      <p>
        <ons-button @click="signup">登録</ons-button>
      </p>
    </form>
  </ons-page>
</template>

<script>
// import ImageCropPage from '../components/ImageCropPage'
import VueCropper from 'vue-cropper'

export default {
  components: { VueCropper },
  data () {
    return {
      name: null,
      age: null,
      prefecture: null,
      gender: 0,
      comment: null,
      vueCropperPreview: {},
      vueCropperOption: {
        img: null,
        size: 1,
        full: false,
        outputType: 'jpg',
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  async mounted () {
    await this.$root.getMyInfo()
    await this.$root.getPrefectures()

    this.name = this.$root.userInfo.name
    this.age = this.$root.userInfo.age
    this.prefecture = this.$root.userInfo.prefecture
    this.gender = this.$root.userInfo.gender
    this.comment = this.$root.userInfo.comment

    if (this.$root.userInfo.uuid !== null) {
      let response = await fetch(`http://a1333.ml/img/profile/${this.$root.userInfo.uuid}.jpg`)
      let blob = await response.blob()
      console.log(blob)
      this.vueCropperOption.img = window.URL.createObjectURL(blob)
      console.log('img loaded')
    }
  },
  methods: {
    async getCroppedBlob () {
      let data = await new Promise(resolve => this.$refs.cropper.getCropBlob((data) => { resolve(data) }))
      return data
    },
    startCrop () {
      this.$refs.cropper.startCrop()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    chooseImg (e) {
      let file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        return false
      }

      let reader = new FileReader()
      reader.onload = (e) => {
        if (typeof e.target.result === 'object') {
          this.vueCropperOption.img = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          this.vueCropperOption.img = e.target.result
        }
        // this.startCrop()
      }
      reader.readAsArrayBuffer(file)
    },
    signup: async function () {
      if (!document.getElementById('name').value || !document.getElementById('age').value) {
        alert('名前と年齢は必須です')
        return
      }
      if (this.$root.userId === null) {
        let data = new FormData(document.getElementById('form1'))
        if (this.vueCropperOption.img !== null) {
          data.append('profile_image', await this.getCroppedBlob())
        }
        let response = await fetch('http://a1333.ml/api/signup', {
          method: 'post',
          mode: 'cors',
          credentials: 'include',
          body: data
        })
        let json = await response.json()
        if (json.success) {
          this.$root.userId = json.user_id
          this.$root.setPushToken()
          alert('プロフを登録しました')
        }
      } else {
        let data = new FormData(document.getElementById('form1'))
        if (this.vueCropperOption.img !== null) {
          data.append('profile_image', await this.getCroppedBlob())
        }
        let response = await fetch('http://a1333.ml/api/update_profile', {
          method: 'post',
          mode: 'cors',
          credentials: 'include',
          body: data
        })
        let json = await response.json()
        if (json.success) {
          this.$root.userId = json.user_id
          this.$root.setPushToken()
          alert('プロフを更新しました')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 100px;
  height: 100px;
}
</style>
