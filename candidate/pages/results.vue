<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <v-main class="center">
          <div v-if="!loading">
            <h1 v-if="finalEvaluation >= passingGrade">You passed the test</h1>
            <h1 v-else>You failed the test</h1>
          </div>
          <h2>Your score:</h2>
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            color="blue"
            indeterminate
          ></v-progress-circular>
          <div v-if="!loading">
            <h1>{{ finalEvaluation % 1 !== 0 ? finalEvaluation.toFixed(2) : finalEvaluation }}</h1>
            <h3>(The passing grade was: {{passingGrade}})</h3>
            <br>
            <br>
            <v-btn x-large elevation="2" color="primary" @click="goToHome">Home</v-btn>
            <v-btn x-large elevation="2" color="green" @click="showResults">Review</v-btn>
          </div>



          <v-dialog
            :key="showIndex"
            v-model="show"
            max-width="800px">

            <v-card>
              <v-card-title>
                <span class="text-h6">Test Results</span>
              </v-card-title>
              <v-card-text>
                <show-test :test-to-show="testResults"></show-test>
              </v-card-text>
            </v-card>

          </v-dialog>
        </v-main>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ResultsPage",
  data() {
    return {
      result: "",
      showIndex: 0,
      show: false,
      loading: true,
    }
  },
  computed: {
    finalEvaluation()
    {
      return this.$store.getters.getFinalEvaluation
    },
    testResults()
    {
      return this.$store.getters.getTest
    },
    passingGrade()
    {
      return this.$store.getters.getPassingGrade
    }


  },
  mounted() {

    if(this.$store.getters.getSubmitted)
    {
      this.loading = false;
    }
    else
    {
      this.$axios.post('candidate/submit-test', {
        test: this.$store.getters.getTest,
      },{
        headers: {
          'Authorization': this.$store.getters.getJWT,
        }
      }).then((res)=>{
        this.$store.dispatch("setTest",res.data.test)
        this.$store.dispatch("setSubmittedToTrue")
        this.loading = false;
      }).catch((err)=>{
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }

  },
  methods: {
    showResults() {
      this.show = true
      this.showIndex++
    },
    goToHome()
    {
      this.$store.dispatch('resetStore')
      localStorage.removeItem('test');
      this.$router.push('/')
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 70px;
}
h2 {
  font-size: 40px;
}
.center{
  text-align: center;
}
</style>
