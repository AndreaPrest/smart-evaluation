<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(addCode)">
        <h2>General Information</h2>
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
        </v-combobox>

        <v-combobox
          v-model="selectedCourses"
          :items="userCoursesNames"
          label= "Select courses"
          multiple
          dense
          chips>
        </v-combobox>

        <h2>Question</h2>
        <validation-provider v-slot="{ errors }" name="question text" rules="required">
          <vue-editor
            id="editor"
            v-model="questionText"
            :useCustomImageHandler = "true"
            @image-added="handleImageAdded">
          </vue-editor>
          <p style="color: red">{{errors[0]}}</p>
        </validation-provider>
          <h3>Libraries</h3>
          <prism-editor v-model="testLibraries" :highlight="highlighter" line-numbers class="my-editor" width="100%"></prism-editor>
          <h3>Tests
            <v-btn icon @click="addTest"> <v-icon small>mdi-plus</v-icon></v-btn>
            <v-btn v-if="tests.length > 1" icon @click="removeTest"> <v-icon small>mdi-minus</v-icon></v-btn>
          </h3>
          <div v-for="(test,index) in tests" :key="index">
            <h4>Test n° {{ index + 1}}</h4>
            <prism-editor v-model="tests[index]" :highlight="highlighter" line-numbers class="my-editor" width="100%"></prism-editor>
          </div>
          <h3>Answer Skeleton</h3>
          <prism-editor v-model="skeleton" :highlight="highlighter" line-numbers class="my-editor" width="100%"></prism-editor>
          <v-btn type="submit" color="green">Submit</v-btn>
          <v-alert :type=errorType :value="alert">
            {{ errorMessage }}
          </v-alert>
          <v-btn color="primary" @click="compileTests">Compile</v-btn>
            <ul v-for="(testResult, index) in compileTestsResult" :key="'compile'+index">
              <li >
                {{ testResult }}
              </li>
            </ul>
          <br>
          <h2>Try it</h2>
          <prism-editor v-model="reference" :highlight="highlighter" line-numbers class="my-editor" width="100%"></prism-editor>
          <v-btn color="primary" @click="tryCode">Try it</v-btn>
            <ul v-for="(codeResult, index) in compileCodeResult" :key="'try'+index">
              <li >
                {{ codeResult }}
              </li>
            </ul>
        <br>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

import 'prismjs/themes/prism-tomorrow.css';
import { ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full.esm';
import {VueEditor} from 'vue2-editor'
import ImageCompression from 'browser-image-compression';

export default {
  name: "AddCode",
  components: {
    ValidationProvider,
    ValidationObserver,
    PrismEditor,
    VueEditor
  },
  data() {
    return {
      skeleton: "/*code skeleton for the student*/",
      tests: ["/*Insert test setup here*/\n/*insert call under test here*/\n/*insert assertion here*/\n/*assert(1==1)*/"],
      testLibraries: "/* IMPORTANT: includes your libraries and aux functions here*/ \n/* IMPORTANT: ONLY THE LIBRARY FOR TESTING! */ \n#include <cassert>\n",
      result: "",
      reference: "/*try your implementation here*/",
      compileCodeResult: [],
      compileTestsResult: [],
      title: "",
      userCourses: [],
      topics: [],
      selectedTopics: [],
      selectedCourses: [],
      questionText: "",
      alert: false,
      errorMessage: "",
      errorType: "error",
    }
  },
  computed: {
    fixedTests()
    {
      return this.tests.map(v => v + " ")
    },
    fixedReference()
    {
      return this.reference + " "
    },
    fixedLibraries()
    {
      return this.testLibraries + " "
    },
    fixedSkeleton()
    {
      return this.skeleton + " "
    },
    completeTests() {
      return this.fixedTests.map(test => "int main(){" + test+ " return 0; }")
    },
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
  async mounted() {
    await this.getTopics()
    await this.getUserCourses()
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
    addTest(){
      this.tests.push("")
    },
    removeTest() {
      this.tests.splice(this.tests.length-1, 1)
    },
    highlighter(code) {
      return highlight(code, languages.cpp, "cpp"); // languages.<insert language> to return html with markup
    },
    addCode(){
      this.$axios.post('eval/add-question', {
        title:this.title,
        question: this.questionText,
        content: {skeleton: this.fixedSkeleton, tests: this.fixedTests, testLibraries: this.fixedLibraries,testPassed: 0},
        courses: this.selectedCoursesIds,
        topics: this.selectedTopicsIds,
        creator: this.$auth.user.email,
        type: "Code"

      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.clearFields()
        this.$refs.observer.reset()
        this.$emit("code-added")
      }).catch((err)=>{
        const code = err.response ? err.response.status : 500
        switch(code){
          case 409:
            this.$refs.observer.reset()
            this.clearFields()
            this.showAlert("SQL Question Already Present in the Database","error")
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
    tryCode() {
      for(const i in this.completeTests)
      {
        this.compileCodeResult = []
        this.$axios.post('eval/compile-code', {
            code: this.fixedLibraries + this.fixedReference + this.completeTests[i] + " ",
            language: "cpp17"
          }
        ).then((res)=>{
          this.compileCodeResult.push(res.data.output ? res.data.output : "jDoodle: No compilation errors")
        }).catch((err)=>{
          this.compileCodeResult.push(err)
        })
      }

    },
    compileTests() {
      this.compileTestsResult = []
      for(const i in this.completeTests)
      {
        this.$axios.post('eval/compile-code', {
            code: this.testLibraries + " " + this.skeleton + " " + this.completeTests[i] + " ",
            language: "cpp17"
          }
        ).then((res)=>{
          this.compileTestsResult.push(res.data.output && res.data.output.toLowerCase().includes("error") ? res.data.output  : "jDoodle: No compilation errors")
        }).catch((err)=>{
          this.compileTestsResult.push(err)
        })

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
    clearFields()
    {
      this.title = ""
      this.question = ""
      this.selectedTopics = []
      this.selectedCourses = []
      this.skeleton = "/*code skeleton for the student*/"
      this.tests = ["/*Insert test setup here*/\n/*insert call under test here*/\n/*insert assertion here*/\n/*assert(1==1)*/"]
      this.testLibraries = "/* IMPORTANT: includes your library here*/ \n #include <cassert>\n"
      this.reference = "/*try your implementation here*/"
      this.compileCodeResult = ""
      this.compileTestsResult = []
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
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}
</style>

