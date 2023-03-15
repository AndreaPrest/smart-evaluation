<template>
  <v-main>
    <v-alert type="error" :value="alert">
      {{ errorMessage }}
    </v-alert>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <form @submit.prevent="userLogin">
                <v-text-field
                  id='user'
                  v-model= 'email'
                  prepend-icon="mdi-account"
                  name="login"
                  label="Username"
                  type="text"
                  required
                  :error-messages="emailErrors"
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                ></v-text-field>
                <v-text-field
                  id="password"
                  v-model = 'password'
                  prepend-icon="mdi-lock"
                  :append-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
                  name="password"
                  label="Password"
                  :type="hidePassword ? 'password' : 'text'"
                  required
                  :error-messages="passwordErrors"
                  @click:append="hidePassword = !hidePassword"
                  @input="$v.password.$touch()"
                  @blur="$v.password.$touch()"
                ></v-text-field>
                <br>
                <v-btn
                  color="green"
                  type="submit"
                >Login
                </v-btn>
              </form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'LoginComponent',
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required }
  },
  data() {
    return {
      email: '',
      password: '',
      hidePassword: true,
      alert:false,
      errorMessage: ""
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')
      return errors
    }
  },
  methods: {
      clearFields()
      {
        this.email = ""
        this.password = ""
        this.hidePassword = true
      },
     async userLogin() {

       this.$v.$touch()
       if (this.$v.$invalid) {
         this.submitStatus = 'ERROR'
       } else {
      try {
        const login = {email: this.email,password:this.password}
        await this.$auth.loginWith('local', { data: login })

      } catch (err) {
        const code = err.response.status
        switch(code){
          case 401:
            this.$v.$reset()
            this.clearFields()
            this.showAlert("Email or Password are wrong")
            break;
          case 500:
            this.$v.$reset()
            this.clearFields()
            this.showAlert("Something is wrong with the server_administration")
            break;
          default:
            this.$v.$reset()
            this.clearFields()
            this.showAlert("Ooooops.. Unexpected Error")
            break;
        }
      }
    }
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
