<template>
  <div>
    <form>
      <v-text-field
        v-model="name"
        label="Name"
        required
        :error-messages="nameErrors"
        dense
        @input="$v.name.$touch()"
        @blur="$v.name.$touch()"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-alert :type=errorType :value="alert">
        {{ errorMessage }}
      </v-alert>
      <v-btn
        color="green"
        class="mr-4"
        @click="editCourse"
      >
        Edit Course
      </v-btn>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required} from 'vuelidate/lib/validators'
import adminComponentsMixin from "@/mixins/adminComponentsMixin";
export default {
  name: "EditCourse",
  mixins: [validationMixin,adminComponentsMixin],
  validations: {
    name: { required },

  },

  props: {
    oldName: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      name: this.oldName,
    }
  },


  methods: {
    editCourse() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.$axios.post('admin/edit-course', {
          _id: this.id,
          name: this.name,
        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        }).then((res)=>{
          this.$v.$reset()
          this.clearFields()
          this.$emit("courseEdited")
        }).catch((err)=>{
          const code = err.response.status
          switch(code){
            case 409:
              this.$v.$reset()
              this.clearFields()
              this.showAlert("Course Already Present in the Database","error")
              break;
            case 1062:
              this.$v.$reset()
              this.clearFields()
              this.showAlert("Database Error","error")
              break;
            default:
              this.$v.$reset()
              this.clearFields()
              this.showAlert("Ooooops.. Unexpected Error","error")
              break;
          }
        })
      }
    },
    clearFields() {
      this.name = ""
    }
  },
}
</script>

<style scoped>

</style>
