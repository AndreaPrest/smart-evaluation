<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(addTest)">
        <v-row no-gutters>
          <v-col
            cols="11">
            <validation-provider v-slot="{ errors }" name="Test Template" rules="required">
              <v-select
                v-model="testTemplateTitle"
                :error-messages="errors[0]"
                :items="testTemplatesTitles"
                label="Test Template">
              </v-select>
            </validation-provider>
          </v-col>
          <v-col
            cols="1">
            <validation-provider v-slot="{ errors }" name="Quantity" rules="required|min_value:1">
              <v-text-field
                v-model="quantity"
                :error-messages="errors[0]"
                type="number"
                min = "0"
                label= "Quantity"
                @keydown="numberFilter($event)">
              </v-text-field>
            </validation-provider>
          </v-col>
        </v-row>
      <v-alert :type=errorType :value="alert">
        {{ errorMessage }}
      </v-alert>
      <v-btn
        type="submit"
        color="green"
      >Add Tests</v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full.esm';
export default {
  name: "AddTest",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      testTemplates: [],
      testTemplateTitle:"",
      quantity:0,
      userCourses: [],
      alert: false,
      errorMessage:"",
      errorType: "error",
    }
  },
  computed: {
    testTemplatesTitles() {
      return this.testTemplates.map(v => v.title)
    },
    userCoursesIds() {
      const s = []
      for (const i in this.userCourses) {
        s.push(this.userCourses[i]._id)
      }
      return s;
    },
    selectedTestTemplateId()
    {
      return  this.testTemplates.filter(v => v.title === this.testTemplateTitle).map(v => v._id)[0]
    }
  },
  async mounted() {
    await this.getUserCourses()
    await this.getTestTemplates()
  },
  methods: {
    addTest()
    {
      this.$axios.post('staff/add-test', {
        testTemplateId: this.selectedTestTemplateId,
        quantity: this.quantity

      }, {
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res) => {
        this.clearFields()
        this.$refs.observer.reset()
        this.$emit("test-added")
      }).catch((err) => {
        const code = err.response.status
        switch (code) {
          case 409:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Test Not Present in the Database", "error")
            break;
          case 407:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Not Enough questions! Contact an evaluator", "error")
            break;
          case 1062:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Database Error", "error")
            break;
          default:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Ooooops.. Unexpected Error", "error")
            break;
        }
      })
    },
    numberFilter(event) {
      const allowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Enter", "Tab"]

      if (!allowed.includes(event.key)) {
        event.preventDefault();
      }
    },
    async getTestTemplates()
    {
      this.loading = true
      try{
        const testTemplates = await this.$axios.post('staff/get-test-templates', {
          courses: this.userCoursesIds

        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.testTemplates = testTemplates.data
        this.loading = false
      }
      catch (e) {
        return this.$nuxt.error({ statusCode: 500, message: 'General Error' })
      }
    },
    async getUserCourses()
    {
      try{
        const courses = await this.$axios.get('user/get-courses', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.userCourses = courses.data
      }
      catch (e)
      {
        this.$nuxt.error({ statusCode: 500, message: 'General Error' })
      }
    },
    clearFields() {
      this.testTemplateTitle = ""
      this.quantity = 0
    },
    showAlert(error,type)
    {
      this.alert = true;
      this.errorMessage = error
      this.errorType = type
      setTimeout(()=>{
        this.alert=false
        this.errorMessage = ""
        this.errorType="error"
      },3000)
    },
  },

}
</script>

<style scoped>

</style>
