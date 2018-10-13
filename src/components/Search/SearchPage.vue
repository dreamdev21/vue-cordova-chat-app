<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item>
        性別
        <v-ons-row>
          <v-ons-select id="gender" v-model="gender">
          <option v-for="item in items" :value="item.value" :key="item.value">
            {{ item.text }}
          </option>
        </v-ons-select>
        </v-ons-row>
      </v-ons-list-item>
      <v-ons-list-item>
        年齢
        <v-ons-row>
          <v-ons-col>
            <v-ons-input type="number" float v-model="ageMin" />～
            <v-ons-input type="number" float v-model="ageMax" />
          </v-ons-col>
        </v-ons-row>
      </v-ons-list-item>
      <v-ons-list-item>
        都道府県
        <v-ons-row>
          <v-ons-select id="prefecture" name="prefecture" v-model="selectedPrefecture">
            <option v-for="x in prefectures" :key="x.id" :value="x.id">{{x.name}}</option>
          </v-ons-select>
        </v-ons-row>
      </v-ons-list-item>
      <v-ons-list-item>
        <ons-button @click="search">検索</ons-button>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import SearchResultPage from './SearchResultPage'

export default {
  data () {
    return {
      prefectures: [],
      selectedItem: -1,
      items: [
        { text: '指定なし', value: -1 },
        { text: '男性', value: 0 },
        { text: '女性', value: 1 }
      ],
      gender: -1,
      selectedPrefecture: 0,
      ageMin: 20,
      ageMax: 29
    }
  },
  async mounted () {
    await this.getPrefectures()
  },
  methods: {
    async getPrefectures () {
      let response = await fetch('http://a1333.ml/api/prefecture', { mode: 'cors', credentials: 'include' })
      let json = await response.json()
      this.prefectures = json
    },
    async search () {
      let response = await fetch('http://a1333.ml/api/search', {
        method: 'post',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(
          {
            gender: this.gender,
            age_min: this.ageMin,
            age_max: this.ageMax,
            prefecture: this.selectedPrefecture
          })
      })
      let json = await response.json()
      if (json.length > 0) {
        this.showSearchResultPage(json)
      } else {
        alert('検索結果: 0件')
      }
    },
    showSearchResultPage: function (users) {
      this.$root.activeTabIndex = this.$root.searchTabIndex
      while (this.$root.searchPageStack.length > 1) {
        this.$root.searchPageStack.pop()
      }
      this.$root.searchPageStack.push({
        extends: SearchResultPage,
        data () {
          return {
            users: users
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ons-list-title {
  text-transform: none;
}

ons-list-item {
  cursor: pointer;
}
</style>
