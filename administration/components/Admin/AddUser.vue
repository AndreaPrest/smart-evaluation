<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }"
    >
    <form @submit.prevent>

      <validation-provider v-slot="{ errors }" name="email" rules="required|email">
        <v-text-field
          v-model="email"
          label="E-mail"
          required
          dense
          :error-messages="errors[0]"
        ></v-text-field>
      </validation-provider>

      <validation-provider v-slot="{ errors }" name="password" rules="required|min:10">
      <v-text-field
        v-model="password"
        label="Password"
        required
        dense
        :error-messages="errors[0]"
      ></v-text-field>
      </validation-provider>

      <validation-provider v-slot="{ errors }" name="roles" rules="required">
      <v-combobox
        v-model="selectedRoles"
        :items="roles"
        label= "Select roles"
        multiple
        dense
        :error-messages="errors[0]"
        chips>
      >
      </v-combobox>
      </validation-provider>

      <validation-provider v-slot="{ errors }" name="courses" rules="required">
      <v-combobox
        v-model="selectedCourses"
        :items="coursesNames"
        label= "Select courses"
        multiple
        dense
        :error-messages="errors[0]"
        chips
        >
      </v-combobox>
      </validation-provider>

      <v-spacer></v-spacer>
      <v-alert :type=errorType :value="alert">
        {{ errorMessage }}
      </v-alert>
      <v-btn
        color="green"
        class="mr-4"
        type="submit"
        @click="handleSubmit(addUser)"
      >
        Add User
      </v-btn>

    </form>
      </validation-observer>
  </div>

</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full.esm';
import adminComponentsMixin from "@/mixins/adminComponentsMixin";
export default {
  name: "AddUser",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [adminComponentsMixin],
  data() {
    return {
      email: "",
      password: "",
      selectedRoles: [],
      selectedCourses: [],
      courses: [],
    }
  },

  computed: {
    coursesNames() {
      return this.courses.map(function (item) {
        return item.name;
      });
    },

    selectedCoursesIds() {
      const s = []
      for (const i in this.selectedCourses) {
        for (const k in this.courses) {
          if (this.selectedCourses[i] === this.courses[k].name) {
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
    addUser() {
      this.$axios.post('admin/add-user', {
        email: this.email,
        password: this.password,
        roles: this.selectedRoles,
        courses: this.selectedCoursesIds
      }, {
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res) => {
        this.clearFields()
        this.$refs.observer.reset()
        this.$emit("userAdded")
      }).catch((err) => {
        const code = err.response.status
        switch (code) {
          case 409:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("User Already Present in the Database", "error")
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
    clearFields() {
      this.email = ""
      this.password = ""
      this.selectedRoles = ""
      this.selectedCourses = ""
    },
    async getCourses() {
      try {
        const courses = await this.$axios.get('admin/get-courses', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.courses = courses.data
      } catch (e) {
        return this.$nuxt.error({statusCode: 500, message: 'General Error'})
      }

    },

  }
}
</script>

<style scoped>

</style>
