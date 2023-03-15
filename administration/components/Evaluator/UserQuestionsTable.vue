<template>
  <v-main>
    <v-data-table
      :headers="headers"
      :items="questions"
      :search="search"
      :loading="loading"
      loading-text="Loading... Please wait"
      @click:row="showQuestion"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>

          <v-spacer></v-spacer>

          <div class="text-center">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Add Question
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  link
                >
                  <v-list-item-title @click="addQuestion(item.type)">{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-toolbar>
      </template>
      <template #[`item.courses`] = "{ item }">

        {{ getCoursesNames(item.courses).toString() }}

      </template>
      <template #[`item.topics`] = "{ item }">

        {{ getTopicsNames(item.topics).toString() }}

      </template>

    </v-data-table>

    <v-dialog
      :key="dialogIndex"
      v-model="dialog"
      max-width="800px"
    >
      <v-card v-if="dialogAction==='Show'">
        <v-card-title>
          <span class="text-h6">Question Details</span>
          <v-spacer></v-spacer>
          <v-icon
            small
            @click="openDuplicate()"
          >
            mdi-content-duplicate
          </v-icon>
          <br>
          <v-icon
            small
            @click="editQuestion()"
          >
            mdi-pencil
          </v-icon>
          <br>
          <v-icon
            small
            @click="openDelete()"
          >
            mdi-delete
          </v-icon>
        </v-card-title>
        <v-card-text>
          <show-question :key="showIndex" :question="questionToHandle" :question-type="questionToHandle.type ? questionToHandle.type : ''"></show-question>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction==='Edit'">
        <v-card-title>
          <span class="text-h6">Edit Question</span>
        </v-card-title>
        <v-card-text>
          <edit-question :key="editIndex" :question="questionToHandle" :question-type="questionToHandle.type ? questionToHandle.type : ''" @question-edited="closeDialog"></edit-question>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction==='Add'">
        <v-card-title>
          <span class="text-h6">Add Question</span>
        </v-card-title>
        <v-card-text>
          <add-question :key="addIndex" :question-type="addType ? addType : ''" @question-added="closeDialog"></add-question>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction==='Delete'">
        <v-card-title class="text-h5">Are you sure you want to delete this question? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteQuestion">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

      <v-card v-if="dialogAction==='Duplicate'">
        <v-card-title class="text-h5">Are you sure you want to duplicate this question? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="duplicateQuestion">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </v-main>
</template>

<script>
import ShowQuestion from "@/components/Evaluator/ShowQuestion";
import EditQuestion from "@/components/Evaluator/EditQuestion";
import AddQuestion from "@/components/Evaluator/AddQuestion";

export default {
  name: "UserQuestionsTable",
  components: {AddQuestion,EditQuestion, ShowQuestion},
  data() {
    return {
      dialogAction: "Show",
      dialog: false,
      addType: "",
      items: [
        {name:"Add Quiz", type: "Quiz"},
        {name:"Add SQL", type: "SQL"},
        {name:"Add Code C++", type: "Code"},
      ],
      dialogIndex: 0,
      showIndex: 0,
      editIndex: 0,
      addIndex: 0,
      questions: [],
      search: "",
      loading: true,
      userCourses: [],
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'Type', value: 'type' },
        { text: 'Courses', value: 'courses'},
        { text: 'Topics', value: 'topics'},
        { text: 'Creator', value: 'creator'},
      ],
      questionToHandle: {},

    }
  },
  computed: {
    userCoursesIds() {
      const s = []
      for (const i in this.userCourses) {
        s.push(this.userCourses[i]._id)
      }
      return s;
    },
  },
  async mounted() {
    await this.getUserCourses();
    await this.getQuestions();
  },
  methods: {
    duplicateQuestion() {
      this.$axios.post('eval/add-question', {
        title:this.questionToHandle.title + " - Copy",
        question: this.questionToHandle.question,
        content: this.questionToHandle.content,
        courses: this.questionToHandle.courses.map(v => v._id),
        topics: this.questionToHandle.topics.map(v => v._id),
        creator: this.$auth.user.email,
        type: this.questionToHandle.type

      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.closeDialog()
      }).catch((err)=>{
        const code = err.response ? err.response.status : 500
        switch(code){
          case 409:
            alert("SQL Question Already Present in the Database")
            this.closeDialog()
            break;
          case 1062:
            alert("Database Error")
            this.closeDialog()
            break;
          default:
            alert("Ooooops.. Unexpected Error")
            this.closeDialog()
            break;
        }
      })
    },
    openDuplicate() {
      this.dialogIndex += 1
      this.dialogAction = "Duplicate"
      this.dialog = true;
    },
    openDelete() {
      this.dialogIndex += 1
      this.dialogAction = "Delete"
      this.dialog = true;
    },
    editQuestion() {
      this.dialogIndex += 1
      this.dialogAction = "Edit"
      this.dialog = true;
      this.editIndex += 1;
    },
    deleteQuestion(){
      this.$axios.post('eval/delete-question',{
        _id:this.questionToHandle._id
      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.closeDialog()
      }).catch((err)=>{
        return this.$nuxt.error({statusCode:500,message:err})
      })
    },
    showQuestion(item) {
      this.dialogIndex += 1
      this.dialogAction = "Show"
      this.dialog = true;
      this.questionToHandle = item;
      this.showIndex += 1;

    },
    addQuestion(type) {

      this.dialogIndex += 1
      this.dialogAction= "Add"
      this.dialog = true
      this.addType = type
      this.addIndex += 1;
    },
    async closeDialog() {
      this.dialogAction= ""
      this.addType = ""
      this.dialog = false
      await this.getQuestions()
    },
    async getUserCourses() {
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
    async getQuestions() {
      this.loading = true
      try{
        const questions = await this.$axios.post('eval/get-questions-of-user', {
          email: this.$auth.user.email
        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.questions = questions.data[0]
        this.loading = false
      }
      catch (e) {
        return this.$nuxt.error({ code: 500, error: 'General Error' })
      }
    },
    getCoursesNames(courses) {
      return courses.map(v => v.name)
    },
    getTopicsNames(topics) {
      return topics.map(topic => topic.name)
    }
  },
}
</script>

<style scoped>

</style>
