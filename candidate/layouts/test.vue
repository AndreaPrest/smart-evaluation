<template>
    <v-app dark>
      <v-app-bar
        app
        elevation="4"
        dense
      >
        <v-toolbar-title>Test</v-toolbar-title>
        <v-spacer></v-spacer>
        <h1>{{ minutes.toString().padStart(2, '0') }} : {{seconds.toString().padStart(2, '0') }}</h1>
      </v-app-bar>
      <Nuxt/>
    </v-app>
</template>

<script>
export default {
  name: "TestLayout",
    data()
    {
      return {
        minutes: this.$store.getters.getAvailableMinutes,
        seconds: this.$store.getters.getAvailableSeconds,
        intervalId: null
      }
    },
  created() {
    // Set the total time for the countdown (in minutes)
    this.minutes = this.$store.getters.getAvailableMinutes;
    this.seconds = this.$store.getters.getAvailableSeconds;
    this.intervalId = setInterval(() => {
      if (this.seconds === 0 || this.$store.getters.isSustained) {
        if (this.minutes === 0 || this.$store.getters.isSustained) {
          clearInterval(this.intervalId);
            this.$axios.post('candidate/submit-test', {
              test: this.$store.getters.getTest,
            },{
              headers: {
                'Authorization': this.$store.getters.getJWT,
              }
            }).then((res)=>{
              this.$store.dispatch("setFinalEvaluation",res.data.finalEvaluation)
              this.$store.dispatch("setSustainedToTrue")
              this.$router.push("results")
            }).catch((err)=>{
              const code = err.response ? err.response.status : 500
              this.$nuxt.error({statusCode: code, message: err.message})
            })
        } else {
          this.seconds = 59;
          this.minutes--;
          this.$store.dispatch('setAvailableMinutes',this.minutes)
          this.$store.dispatch('setAvailableSeconds',this.seconds)
        }
      } else {
        this.seconds--;
        this.$store.dispatch('setAvailableSeconds',this.seconds)
      }
    }, 1000);
  },
}
</script>

<style scoped>

</style>
