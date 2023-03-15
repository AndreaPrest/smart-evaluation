<template>
  <div>
        <h3>General Information</h3>
          <v-text-field
            :value="testTemplate.title"
            label="Title"
            readonly>
          </v-text-field>

          <v-text-field
            :value="testTemplate.course.name"
            readonly
            label="Course">
          </v-text-field>

          <v-text-field
            :value="testTemplate.passingGrade"
            label="Passing Grade"
            type="number">
          </v-text-field>

          <v-text-field
            :value="testTemplate.availableMinutes"
            label="Available Minutes"
            type="number"
            readonly>
          </v-text-field>

        <h3>Topics</h3>

        <v-row v-for="(v, index) in testTemplate.template" :key="index" no-gutters>
          <v-col
            cols="10">
              <v-text-field
                readonly
                :value="v.topic.name"
                label="Topic">
              </v-text-field>
          </v-col>

          <v-col
            cols="1">
              <v-text-field
                :value="v.questionNumber"
                readonly
                label= "Quantity">
              </v-text-field>
          </v-col>

          <v-col
            cols="1">
              <v-text-field
                :value="v.questionValue"
                label="Value - %">
                readonly
              </v-text-field>
          </v-col>

          <v-alert :type=errorType :value="alert">
            {{ errorMessage }}
          </v-alert>
        </v-row>
  </div>
</template>

<script>
export default {
  name: "ShowTestTemplate",
  props: {
    testTemplate: {
      type: Object,
      required: true
    },
  },
    data() {
      return {
        errorMessage: "",
        errorType: "error",
        alert: false,
      }
    },
}
</script>

<style scoped>

</style>
