<template>
  <ons-page>
    <v-ons-toolbar>
      <div class="right">
        <v-ons-toolbar-button @click="onAgreeButtonClick">同意する</v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <iframe src="http://a1333.ml/terms" frameborder="0" />
  </ons-page>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    async onAgreeButtonClick () {
      this.$root.pageStack.pop()
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
