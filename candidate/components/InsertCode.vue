<template>
  <v-main>
    <v-alert type="error" :value="alert">
      {{ errorMessage }}
    </v-alert>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md5>
          <v-card class="elevation-12">
            <v-toolbar dark>
              <v-toolbar-title>Insert code</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <form>
                <v-text-field
                  id='code'
                  v-model= 'code'
                  name="code"
                  label="Insert code.."
                  type="text"
                  required
                ></v-text-field>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green"
                @click='sendCode'
              >Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "InsertCode",
  mounted() {
    this.$store.dispatch('resetStore')
    localStorage.removeItem('test');
  },
  data() {
    return {
      code: "",
      alert:false,
      errorMessage: ""
    }
  },
  methods: {
    sendCode() {
      // Add alert if sure
      this.$axios.post('auth/authenticate', {
        code: this.code
      },).then((res)=>{
          this.$store.dispatch('setToken',res.data.token)
          this.$axios.post('candidate/get-test', {code: this.code},{
            headers: {
              'Authorization': this.$store.getters.getJWT,
            }
          })
            .then((res)=>{
              this.$store.dispatch('setTest',res.data.test)
              if(res.data.type !== "results")
              {
                this.$store.dispatch('setPassingGrade',res.data.test.passingGrade)
                this.$store.dispatch('setAvailableMinutes',res.data.test.availableMinutes)
                this.$router.push("test")
              }
              else
              {
                this.$store.dispatch('setPassingGrade',res.data.test.passingGrade)
                this.$store.dispatch('setSustainedToTrue')
                this.$store.dispatch('setFinalEvaluation',res.data.test.finalEvaluation)
                this.$router.push("results")
              }
              })
            .catch(()=>{
              this.showAlert("Oooops.. Unexpected Error","error")
            })
      }).catch((err)=>{
        const code = err.response ? err.response.status : 0
        switch(code){
          case 404:
            this.showAlert("Wrong Code!","error")
            break;
          case 402:
            this.showAlert("Test expired!!","error")
            break;
          default:
            this.showAlert("Ooooops.. Unexpected Error","error")
            break;
        }
      })
    },
    showAlert(error)
    {
      this.alert = true;
      this.errorMessage = error
      setTimeout(()=>{
        this.alert=false
        this.errorMessage = ""
      },3000)
    }
  },

}
</script>

<style scoped>

</style>
