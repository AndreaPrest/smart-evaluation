<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }"
    >
    <form @submit.prevent="handleSubmit(addQuiz)">
      <h3>General Information</h3>
      <validation-provider v-slot="{ errors }" name="title" rules="required">
        <v-text-field
          v-model="title"
          label="Title"
          :error-messages="errors[0]">
        </v-text-field>
      </validation-provider>

      <v-combobox
        v-model="selectedTopics"
        :items="topicsNames"
        label= "Select topics"
        multiple
        dense
        chips>
        >
      </v-combobox>

      <v-combobox
        v-model="selectedCourses"
        :items="userCoursesNames"
        label= "Select courses"
        multiple
        dense
        chips>
        >
      </v-combobox>
      <h3>Question</h3>
      <validation-provider v-slot="{ errors }" name="question" rules="required">
        <vue-editor
          id="editor"
          v-model="questionText"
          :useCustomImageHandler = "true"
          @image-added="handleImageAdded">
        </vue-editor>
        <p style="color: red">{{errors[0]}}</p>
      </validation-provider>

        <h3>Answers
          <v-btn
          icon
          @click="addAnswer()"
        >
          <v-icon>mdi-plus</v-icon>
          </v-btn>
        </h3>

        <div v-for="(answer, index) in answers" :key="index">
            <validation-provider v-slot="{ errors }" :name="answerLabel(index)" rules="required">
              <v-text-field
                v-model="answer.answerText"
                :label="answerLabel(index)"
                :error-messages = "errors[0]"
              >
                  <div slot="prepend">
                    <validation-provider  v-slot="{ errors }" rules="required">
                      <v-checkbox
                        v-model="correctAnswers"
                        :value="index"
                        :error-messages= "errors[0] ? 'Select at least one!' : ''"
                      />
                    </validation-provider>
                </div>
                <v-btn
                  v-if="index > 1"
                  slot="append"
                  icon
                  @click="removeAnswer(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-text-field>
            </validation-provider>
        </div>
      <v-alert :type=errorType :value="alert">
        {{ errorMessage }}
      </v-alert>
    <v-btn
      type="submit"
      color="green"
    >Submit</v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full.esm';
import ImageCompression from "browser-image-compression";
import {VueEditor} from 'vue2-editor'

export default {

  name: "AddQuiz",
  components: {
    ValidationProvider,
    ValidationObserver,
    VueEditor
  },
  data() {
    return {
      title: "",
      questionText: "",
      answers: [
        {answerText: ""},
        {answerText: ""}
      ],
      correctAnswers: [],
      userCourses: [],
      topics: [],
      selectedTopics: [],
      selectedCourses: [],
      alert: false,
      errorMessage:"",
      errorType: "error",
    }
  },
  computed: {
    topicsNames() {
      return this.topics.map(function (item) {
        return item.name;
      });
    },
    userCoursesNames() {
      return this.userCourses.map(function (item) {
        return item.name;
      });
    },
    selectedCoursesIds() {
      const s = []
      for (const i in this.selectedCourses) {
        for (const k in this.userCourses) {
          if (this.selectedCourses[i] === this.userCourses[k].name) {
            s.push(this.userCourses[k]._id)
          }
        }
      }
      return s;
    },
    selectedTopicsIds() {
      const s = []
      for (const i in this.selectedTopics) {
        for (const k in this.topics) {
          if (this.selectedTopics[i] === this.topics[k].name) {
            s.push(this.topics[k]._id)
          }
        }
      }
      return s;
    },
  },
  mounted() {
    this.getTopics()
    this.getUserCourses()
  },
  methods: {
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      ImageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 720,
        useWebWorker: true
      })
        .then(compressedImage => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedImage);
          reader.onload = () => {
            const imageBase64 = reader.result;
            Editor.insertEmbed(cursorLocation, "image", imageBase64);
            resetUploader();
          };
        })
        .catch(() => {
          this.$refs.observer.reset()
          this.clearFields()
          this.showAlert("Ooooops.. Unexpected Error","error")
        });
    },
    answerLabel(n) {
      return "Answer n° " + (n+1);
    },
    addAnswer() {
      this.answers.push({
        answer: "",
      });
    },
    removeAnswer(index) {
      this.answers.splice(index, 1);
      if(this.correctAnswers.includes(index))
      {
        this.correctAnswers.splice(this.correctAnswers.indexOf(index), 1);
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

    async getTopics()
    {
      try{
        const topics = await this.$axios.get('eval/get-topics-list', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.topics = topics.data
      }
      catch (e)
      {
        this.$nuxt.error({ statusCode: 500, message: 'General Error' })
      }
    },
    addQuiz()
    {
      this.$axios.post('eval/add-question', {
        title:this.title,
        question: this.questionText,
        content: {answers: this.answers, correctAnswers: this.correctAnswers},
        courses: this.selectedCoursesIds,
        topics: this.selectedTopicsIds,
        creator: this.$auth.user.email,
        type: "Quiz"

      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.clearFields()
        this.$refs.observer.reset()
        this.$emit("quiz-added")
      }).catch((err)=>{
        const code = err.response.status
        switch(code){
          case 409:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Quiz Already Present in the Database","error")
            break;
          case 1062:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Database Error","error")
            break;
          default:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("Ooooops.. Unexpected Error","error")
            break;
        }
      })
    },

    clearFields()
    {
      this.title = ""
      this.questionText =  ""
      this.answers = [{answerText: ""}, {answerText: ""}]
      this.correctAnswers = []
      this.selectedTopics = []
      this.selectedCourses = []
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
