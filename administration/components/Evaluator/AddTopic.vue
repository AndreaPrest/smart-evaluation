<template>
  <v-main>
    <form>
      <v-text-field
        disabled
        :value="parentName"
        label="Parent"
        dense
      ></v-text-field>
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
        @click="addTopic"
      >
        Submit
      </v-btn>
    </form>
  </v-main>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  name: "AddTopic",
  mixins: [validationMixin],
  validations: {
    name: { required },

  },
  props: {
    parentName: {
      type: String,
      required:true
    },

    parentId: {
      type: String,
      required:true
    },
  },
  data() {
    return {
      alert:false,
      name: "",
      errorMessage:"",
      errorType: "error",
    }
  },

  computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
  },

  methods: {
    addTopic() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.$axios.post('eval/add-topic', {
          parentId: this.parentId,
          name: this.name,
        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        }).then((res)=>{
          this.$v.$reset()
          this.clearFields()
          this.$emit("topic-added")
        }).catch((err)=>{
          const code = err.response.status
          switch(code){
            case 409:
              this.$v.$reset()
              this.clearFields()
              this.showAlert("Topic Already Present in the Database","error")
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
