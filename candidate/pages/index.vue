<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <v-main class="center">
          <h1> Candidate Page </h1>
        </v-main>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'index',
  asyncData(ctx) {
    ctx.store.dispatch('resetStore')
    localStorage.removeItem('test');
  }
}
</script>

<style scoped>
h1 {
  font-size: 70px;
}
.center{
  text-align: center;
}
</style>
