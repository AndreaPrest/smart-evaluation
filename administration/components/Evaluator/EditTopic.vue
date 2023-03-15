<template>
  <v-main>
    <form @submit.prevent="editTopic">
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
        type="submit"
      >
        Edit
      </v-btn>
    </form>
  </v-main>
</template>

<script>
import {validationMixin} from "vuelidate";
import {required} from "vuelidate/lib/validators";

export default {
  name: "EditTopic",
  mixins: [validationMixin],
  validations: {
    name: { required },

  },
  props: {

    topicId: {
      type: String,
      required:true
    },
    oldName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      alert:false,
      errorMessage:"",
      errorType: "error",
      name: this.oldName
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
    editTopic() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.$axios.post('eval/edit-topic', {
          _id: this.topicId,
          name: this.name,
        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        }).then((res)=>{
          this.$v.$reset()
          this.$emit("topic-edited")
        }).catch((err)=>{
          const code = err.response.status
          switch(code){
            case 409:
              this.$v.$reset()
              this.showAlert("Topic Already Present in the Database","error")
              break;
            case 1062:
              this.$v.$reset()
              this.showAlert("Database Error","error")
              break;
            default:
              this.$v.$reset()
              this.showAlert("Ooooops.. Unexpected Error","error")
              break;
          }
        })
      }
    },
  },
}
</script>

<style scoped>

</style>
