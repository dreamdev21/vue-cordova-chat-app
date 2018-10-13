<template>
  <v-ons-page id="app">
    <v-ons-navigator
      swipeable
      :page-stack="$root.pageStack"
      @deviceBackButton="onDeviceBackButton"
    ></v-ons-navigator>
  </v-ons-page>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
    onDeviceBackButton (e) {
      // 戻るボタンを無効にする
      e.preventDefault()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
