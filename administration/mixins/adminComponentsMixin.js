export default {
  data() {
    return {
      alert:false,
      errorMessage:"",
      errorType: "error",
      roles: [
        "Administrator",
        "Evaluator",
        "Staff"
      ],
    }
  },
  methods: {
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

  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
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
    },
    roleErrors () {
      const errors = []
      if (!this.$v.selectedRoles.$dirty) return errors
      !this.$v.selectedRoles.required && errors.push('Role is required.')
      return errors
    },
    courseErrors () {
      const errors = []
      if (!this.$v.selectedCourses.$dirty) return errors
      return errors
    }
  },
}
