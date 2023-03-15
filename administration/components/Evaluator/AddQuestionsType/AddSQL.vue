<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }">

      <form @submit.prevent="handleSubmit(addSQL)">
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
        <br>
          <validation-provider v-slot="{ errors }" name="question text" rules="required">
            <vue-editor
              id="editor"
              v-model="questionText"
              :useCustomImageHandler = "true"
              @image-added="handleImageAdded">
            </vue-editor>
            <p style="color: red">{{errors[0]}}</p>
          </validation-provider>

        <h3>Database Schema</h3>
        <validation-provider v-slot="{ errors }" name="database schema" rules="required">
          <prism-editor v-model="databaseSchema" :highlight="highlighter" line-numbers class="my-editor" width="100%"></prism-editor>
          <p style="color: red">{{ errors[0] }}</p>
        </validation-provider>

        <h3>Snapshot Data
          <v-btn icon @click="addEmptyDatabase"><v-icon>mdi-plus</v-icon></v-btn>
          <v-btn v-if="snapshotData.length>1" icon @click="removeLastDatabase"><v-icon>mdi-minus</v-icon></v-btn>
        </h3>

        <div v-for="(database,index) in snapshotData" :key="index">
        <h4>Data Table n° {{ index + 1 }}</h4>
          <validation-provider v-slot="{ errors }" name="table" rules="required">
            <prism-editor v-model="snapshotData[index]" :highlight="highlighter" line-numbers class="my-editor" width="100%"></prism-editor>
            <p style="color: red">{{ errors[0] }}</p>
          </validation-provider>
        </div>

        <h4>Query</h4>
        <validation-provider v-slot="{ errors }" name="query" rules="required">
          <prism-editor v-model="query" :highlight="highlighter" line-numbers class="my-editor" width="100%"></prism-editor>
          <p style="color: red">{{ errors[0] }}</p>
        </validation-provider>

        <v-row>
          <v-col>
            <v-checkbox v-model="sameColumnRelevant" label="Are allowed more columns?"></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox v-model="orderRelevant" label="Is the order relevant?"></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox v-model="multiplicityRelevant" label="Is multiplicity relevant?"></v-checkbox>
          </v-col>
        </v-row>

        <v-btn type="submit" color="green">Submit</v-btn>
        <v-btn color="primary" @click="testQuestion">Test</v-btn>
        <v-alert :type=errorType :value="alert">
        {{ errorMessage }}
        </v-alert>
        <div v-if="showResults">
        <h4 v-if="results.length > 0">Results:</h4>
            <div v-for="(result,index) in results" :key="index">
              <div v-for="(res,i) in result" :key="i">
                <h3>Table n° {{ i + 1 }}</h3>
                <v-simple-table>
                  <template #default>
                    <thead>
                    <tr>
                      <th v-for="(column,key) in res['columns']" :key="key">
                        {{ column }}
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                      v-for="(values,key) in res['values']" :key="key"
                    >
                      <td v-for="(value,k) in values" :key="k">{{ value }}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </div>
        <h4 v-if="queryErrors.length > 0">Error:</h4>
          <ul>
            <li v-for="(error,index) in queryErrors" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'prismjs/components/prism-sql';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import SQL from 'sql.js'
import { ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full.esm';
import {VueEditor} from 'vue2-editor'
import ImageCompression from 'browser-image-compression';

export default {
  name: "AddSQL",
  components: {
    ValidationProvider,
    ValidationObserver,
    PrismEditor,
    VueEditor
  },
  data() {
    return {
      query: "SELECT * FROM test;",
      snapshotData: ["INSERT INTO test VALUES ('1','2');"],
      results: [],
      queryErrors: [],
      showResults: false,
      db: new SQL.Database(),
      title:"",
      userCourses: [],
      topics: [],
      selectedTopics: [],
      selectedCourses: [],
      questionText: "",
      alert: false,
      errorMessage:"",
      errorType: "error",
      databaseSchema: "CREATE TABLE test (col1,col2);",
      sameColumnRelevant:false,
      orderRelevant:false,
      multiplicityRelevant:false,
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
    headers(columns) {
      return columns.map(column => {
        return { text: column, value: column }
      })
    },
    highlighter(code) {
      return highlight(code, languages.sql, "sql"); // languages.<insert language> to return html with markup
    },
    async getUserCourses(){
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
    async getTopics() {
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
    addSQL() {
      this.$axios.post('eval/add-question', {
        title:this.title,
        question: this.questionText,
        content: {snapshotTables: this.snapshotData,query: this.query,testPassed: 0,databaseSchema:this.databaseSchema, orderRelevant: this.orderRelevant, sameColumnRelevant: this.sameColumnRelevant, multiplicityRelevant: this.multiplicityRelevant},
        courses: this.selectedCoursesIds,
        topics: this.selectedTopicsIds,
        creator: this.$auth.user.email,
        type: "SQL"

      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.clearFields()
        this.$refs.observer.reset()
        this.$emit("sql-added")
      }).catch((err)=>{
        const code = err.response.status
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
    testQuestion() {
      this.results = []
      this.queryErrors = []
      for(const i in this.snapshotData)
      {
        this.resetDB()
        this.generateDB(this.databaseSchema + this.snapshotData[i])
        this.makeQuery(this.query)
      }
      this.showResults = true

    },
    generateDB(database) {
      try {
        this.db.exec(database)
      } catch (err) {
        this.queryErrors.push(err.message)
      }
    },
    resetDB() {
      this.db.close()
      this.db = new SQL.Database()
    },
    makeQuery(query) {
      try {
        this.results.push(this.db.exec(query))
      } catch (e) {
        this.queryErrors.push(e.message)
      }
    },
    addEmptyDatabase(){
      this.snapshotData.push("")
    },
    removeLastDatabase(){
      this.snapshotData.splice(this.snapshotData.length-1, 1);
    },
    clearFields(){
      this.title = ""
      this.snapshotData =  [""]
      this.questionText = ""
      this.query = ""
      this.question = ""
      this.selectedTopics = []
      this.selectedCourses = []
    },
    showAlert(error,type) {
      this.alert = true;
      this.errorMessage = error
      this.errorType = type
      setTimeout(()=>{
        this.alert=false
        this.errorMessage = ""
        this.errorType="error"
      },3000)
    },
  }
}
</script>

<style scoped>
@import "~vue2-editor/dist/vue2-editor.css";
@import '~quill/dist/quill.snow.css';

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
