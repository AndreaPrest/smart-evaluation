<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(editTestTemplate)">
        <h3>General Information</h3>
        <validation-provider v-slot="{ errors }" name="title" rules="required">
          <v-text-field
            v-model="title"
            label="Title"
            :error-messages="errors[0]">
          </v-text-field>
        </validation-provider>

        <validation-provider v-slot="{ errors }" name="passing grade" rules="required|min_value:1|max_value:100">
          <v-text-field
            v-model="passingGrade"
            label="Passing Grade"
            type="number"
            :error-messages="errors[0]">
          </v-text-field>
        </validation-provider>

        <validation-provider v-slot="{ errors }" name="available minutes" rules="required|min_value:1">
          <v-text-field
            v-model="availableMinutes"
            label="Available Minutes"
            type="number"
            :error-messages="errors[0]">
          </v-text-field>
        </validation-provider>

        <validation-provider v-slot="{ errors }" name="course" rules="required">
          <v-select
            v-model="course"
            :error-messages="errors[0]"
            :items="userCoursesNames"
            label="Course">
          </v-select>
        </validation-provider>
        <h3>Topics
          <v-btn icon @click="addMore">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="template.length > 1"
            icon
            @click="removeLast()"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </h3>
        <v-row v-for="(v, index) in template" :key="index" no-gutters>
          <v-col
            cols="10">
            <validation-provider v-slot="{ errors }" :name="getTopicValidatorName(index)" rules="required">
              <v-select
                v-model="v.topic"
                :error-messages="errors[0]"
                :items="topicsNames"
                :label="getTopicValidatorName(index)">
              </v-select>
            </validation-provider>
          </v-col>

          <v-col
            cols="1">
            <validation-provider v-slot="{ errors }" :name="getQuantityValidatorName(index)" :rules="getMaxQuestionsRule(v.topic)">
              <v-text-field
                v-model="v.questionNumber"
                :disabled="v.topic.name === ''"
                :error-messages="errors[0]"
                type="number"
                min = "0"
                :max = "getMaxQuestionsForTopic(v.topic)"
                :label= "getQuantityValidatorName(index)"
                @keydown="numberFilter($event)">
              </v-text-field>
            </validation-provider>
          </v-col>

          <v-col
            cols="1">
            <validation-provider v-slot="{ errors }" :name="getValueValidatorName(index)" :rules="percentageRule(index)">
              <v-text-field
                v-model="v.questionValue"
                :disabled="v.topic === ''"
                :error-messages="errors[0] ? 'Percentages must sum up to 100%' : ''"
                type="number"
                min = "0"
                max = "100"
                :label="getValueValidatorName(index)"
                @keydown="percentageFilter($event,v.questionValue)">
              </v-text-field>
            </validation-provider>
          </v-col>
          <v-alert :type=errorType :value="alert">
            {{ errorMessage }}
          </v-alert>
        </v-row>
        <v-btn color="green" type="submit">Edit</v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate/dist/vee-validate.full.esm";
export default {
  name: "EditTestTemplate",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    oldTestTemplate: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      topics: [],
      template: this.templateWithNames(this.oldTestTemplate.template),
      title: this.oldTestTemplate.title,
      course: this.oldTestTemplate.course.name,
      userCourses: [],
      alert: false,
      errorMessage: "",
      errorType: "error",
      passingGrade: this.oldTestTemplate.passingGrade,
      availableMinutes:this.oldTestTemplate.availableMinutes
    }
  },
  computed: {
    topicsNames() {
      return this.topics.filter(v => v.questionsNumber > 0).map(v => v.name)
    },
    userCoursesNames() {
      return this.userCourses.map(function (item) {
        return item.name;
      });
    },
    courseId() {
      return this.userCourses.find(({name}) => name === this.course)._id
    }
  },
  async mounted() {
    await this.getUserCourses()
    await this.getTopics()
  },
  methods: {
    templateWithIds() {
      const templateComplete = JSON.parse(JSON.stringify(this.template));
      for (const i in templateComplete) {
        templateComplete[i].topic = this.getTopicId(templateComplete[i].topic)
      }

      return templateComplete
    },

    templateWithNames(template) {
      const templateComplete = JSON.parse(JSON.stringify(template));
      for (const i in templateComplete) {
        templateComplete[i].topic = templateComplete[i].topic.name
      }
      return templateComplete
    },
    getTopicId(topic) {
      return this.topics.find(({name}) => name === topic)._id
    },
    removeLast() {
      this.template.pop()
    },
    getTopicValidatorName(index) {
      return "Topic n° " + (index + 1)
    },
    getQuantityValidatorName(index) {
      return "Quantity n° " + (index + 1)
    },
    getValueValidatorName(index) {
      return "Value% - n° " + (index + 1)
    },
    addMore() {
      this.template.push({topic: "", questionNumber: 0, questionValue: 0})
    },
    editTestTemplate() {
      this.$axios.post('eval/edit-test-template', {
        _id:this.oldTestTemplate._id,
        title: this.title,
        course: this.courseId,
        creator: this.$auth.user.email,
        template: this.templateWithIds(),
        availableMinutes:this.availableMinutes,
        passingGrade: this.passingGrade

      }, {
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res) => {
        this.clearFields()
        this.$refs.observer.reset()
        this.$emit("test-template-edited")
      }).catch((err) => {
        const code = err.response.status
        switch (code) {
          case 409:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Test Template Already Present in the Database", "error")
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
    percentageRule(i) {
      const others = this.template.filter((value, index) => i !== index);
      if (others.length === 0) {
        return "required|min_value:1|is:100"
      } else {
        let sum = 0;
        others.forEach(element => {
          sum += parseFloat(element.questionValue);
        });
        const value = 100 - sum
        return "required|min_value:1|is:" + value
      }
    },
    getMaxQuestionsRule(topic) {
      if (topic === "" || this.topics.length === 0 || topic === undefined) {
        return "required|min_value:1"
      } else {
        return "required|max_value:" + this.topics.filter(v => v.name === topic)[0].questionsNumber + "|min_value:1"
      }
    },
    getMaxQuestionsForTopic(topic) {
      if (topic === "" || this.topics.length === 0 || topic === undefined) {
        return 0
      } else {
         return this.topics.filter(v => v.name === topic)[0].questionsNumber
      }

    },
    numberFilter(event) {
      const allowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Enter", "Tab"]

      if (!allowed.includes(event.key)) {
        event.preventDefault();
      }
    },
    percentageFilter(event, previousValue) {
      const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
      const actions = ["Backspace", "Enter", "Tab"]
      const dividers = [".", ","]

      if (!numbers.includes(event.key) && !actions.includes(event.key) && !dividers.includes(event.key)) {
        event.preventDefault();
      } else if (numbers.includes(event.key)) {
        const currentValue = parseFloat(previousValue + event.key)
        if (currentValue > 100) {
          event.preventDefault();
        }
      } else if (dividers.includes(event.key)) {
        for (const div in dividers) {
          if (previousValue.toString().includes(dividers[div])) {
            event.preventDefault();
          }
        }
      }
    },
    async getUserCourses() {
      try {
        const courses = await this.$axios.get('user/get-courses', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.userCourses = courses.data
      } catch (e) {
        this.$nuxt.error({code: 500, error: 'General Error'})
      }
    },
    async getTopics() {
      try {
        const topics = await this.$axios.get('eval/get-topics-list', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.topics = topics.data
      } catch (e) {
        this.$nuxt.error({code: 500, error: 'General Error'})
      }
    },
    clearFields() {
      this.topics = []
      this.template = [{topic: "", questionNumber: 0, questionValue: 0}]
      this.title = ""
      this.course = ""
      this.userCourses = []
    },
    showAlert(error, type) {
      this.alert = true;
      this.errorMessage = error
      this.errorType = type
      setTimeout(() => {
        this.alert = false
        this.errorMessage = ""
        this.errorType = "error"
      }, 3000)
    },
  },
}
</script>

<style scoped>

</style>
