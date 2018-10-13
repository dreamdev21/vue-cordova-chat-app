<template>
  <v-ons-page>
    <v-ons-navigator
      swipeable
      :page-stack="$root.searchPageStack"
    ></v-ons-navigator>
  </v-ons-page>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
