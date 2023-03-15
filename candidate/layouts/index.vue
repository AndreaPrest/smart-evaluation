<template>
  <v-app dark>
    <v-app-bar
      app
      elevation="4"
      dense
    >
      <v-toolbar-title @click="$router.push('/')">Smart Evaluation</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="$router.push('/start')"
      >Insert Code
      </v-btn>
    </v-app-bar>
    <Nuxt/>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>
