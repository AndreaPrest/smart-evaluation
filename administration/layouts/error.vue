<template>
  <v-app dark>
    <v-app-bar
      app
      elevation="4"
      dense
    ><v-toolbar-title>Smart Evaluation</v-toolbar-title>
    </v-app-bar>
    <v-container fill-height fluid>
      <v-row align="center"
             justify="center">
        <v-col>
          <v-main class="center">
            <h1 v-if="error.statusCode === 404">
              {{ pageNotFound }}
            </h1>
            <h1 v-else-if="error.statusCode === 401">
              {{ authorizationError }}
            </h1>
            <h1 v-else>
              {{ otherError }}
            </h1>
            <v-btn
              v-if="error.statusCode === 401"
              x-large
              color="info"
              @click="goToPage('/login')"> Login </v-btn>
            <v-btn
              x-large
              color="green"
              dark
              @click="goToPage('/')"
            > Home page </v-btn>
          </v-main>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'This Page Does Not Exist!',
      authorizationError: 'You Are Not Authorized!',
      otherError: 'Oooops..Something Went Wrong!',
    }
  },
  methods: {
    goToPage(page) {
      this.$nuxt.$router.push(page)
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
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
