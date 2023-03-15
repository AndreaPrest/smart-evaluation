<template>
  <div>
    <form>
      <v-text-field
        v-model="email"
        :error-messages="emailErrors"
        label="E-mail"
        required
        dense
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="New Password"
        dense
      ></v-text-field>

      <v-combobox
        v-model="selectedRoles"
        :items="roles"
        label= "Select roles"
        multiple
        dense
        required
        :error-messages="roleErrors"
        chips
        @input="$v.selectedRoles.$touch()"
        @blur="$v.selectedRoles.$touch()">
      </v-combobox>
      <v-combobox
        v-model="selectedCourses"
        :items="coursesNames"
        label= "Select courses"
        multiple
        dense
        :error-messages="courseErrors"
        chips
        @input="$v.selectedCourses.$touch()"
        @blur="$v.selectedCourses.$touch()">
        >
      </v-combobox>
      <v-spacer></v-spacer>
      <v-alert :type=errorType :value="alert">
        {{ errorMessage }}
      </v-alert>
      <v-btn
        color="green"
        class="mr-4"
        @click="editUser"
      >
        Save
      </v-btn>
    </form>
  </div>
</template>

<script>
import {validationMixin} from "vuelidate";
import {email, required} from "vuelidate/lib/validators";
import adminComponentsMixin from "@/mixins/adminComponentsMixin";

export default {
  name: "EditUser",
  mixins: [validationMixin,adminComponentsMixin],
  validations: {
    email: { required, email },
    selectedRoles: {required},
    password: {},
    selectedCourses: {}

  },
  props: {
    oldEmail: {
      type: String,
      required: true
    },
    oldRoles: {
      type: Array,
      required: true
    },
    oldCourses: {
      type: Array,
      default(){
        return []
      }
    },
  },
  data() {
    return {
      password: "",
      email: this.oldEmail,
      selectedRoles: this.oldRoles,
      selectedCourses: this.oldCourses,
      courses: [],
    }
  },
  computed: {
    coursesNames() {
      return this.courses.map(function(item) {
        return item.name;
      });
    },

    selectedCoursesIds()
    {
      const s = []
      for(const i in this.selectedCourses)
      {
        for(const k in this.courses)
        {
          if(this.selectedCourses[i] === this.courses[k].name)
          {
            s.push(this.courses[k]._id)
          }
        }
      }

      return s;
    },

  },
  async mounted() {
    await this.getCourses()
  },
  methods: {
    async getCourses()
    {
      try{
        const courses = await this.$axios.get('admin/get-courses', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.courses = courses.data
      }catch (e) {
        return this.$nuxt.error({ statusCode: 500, message: 'General Error' })
      }

    },
    editUser()
    {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.$axios.post('admin/edit-user', {
          oldEmail: this.oldEmail,
          email: this.email,
          password: this.password,
          roles: this.selectedRoles,
          courses: this.selectedCoursesIds
        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        }).then((res)=>{
          this.$v.$reset()
          this.clearFields()
          this.$emit("userEdited")
        }).catch((err)=>{
          const code = err.response.status
          switch(code){
            case 409:
              this.$v.$reset()
              this.clearFields()
              this.showAlert("User Not Present in the Database","error")
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
      this.email = ""
      this.password = ""
      this.selectedRoles = ""
      this.selectedCourses = ""
    },
  },
}
</script>

<style scoped>

</style>
