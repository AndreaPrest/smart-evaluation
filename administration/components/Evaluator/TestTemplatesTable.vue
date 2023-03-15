<template>
  <v-main>
    <v-data-table
      :headers="headers"
      :items="testTemplates"
      :search="search"
      :loading="loading"
      loading-text="Loading... Please wait"
      @click:row="showTestTemplate"
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
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="addTestTemplate"
            >
              Add Test Template
            </v-btn>
          </div>
        </v-toolbar>
      </template>
      <template #[`item.course`] = "{ item }">

        {{ item.course.name.toString() }}

      </template>
      <template #[`item.topics`] = "{ item }">

        {{ getTopicsNames(item).toString() }}

      </template>

      <template #[`item.tot`] = "{ item }">
        {{ getNumberOfQuestions(item)}}

      </template>

    </v-data-table>

    <v-dialog
      :key="dialogIndex"
      v-model="dialog"
      max-width="800px">

      <v-card v-if="dialogAction==='Show'">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-icon
            v-if="testTemplateToHandle.creator === $auth.user.email"
            small
            @click="editTestTemplate()"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="testTemplateToHandle.creator === $auth.user.email"
            small
            @click="openDelete()"
          >
            mdi-delete
          </v-icon>
        </v-card-title>
        <v-card-text>
          <show-test-template :key="showIndex" :test-template="testTemplateToHandle"></show-test-template>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction ==='Add'">
        <v-card-title>
          <span class="text-h6">Add Test Template</span>
        </v-card-title>
        <v-card-text>
          <AddTestTemplate :key="addIndex" @test-template-added="closeDialog"></AddTestTemplate>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction==='Edit'">
        <v-card-title>
          <span class="text-h6">Edit Test Template</span>
        </v-card-title>
        <v-card-text>
          <edit-test-template :key="editIndex" :old-test-template="testTemplateToHandle" @test-template-edited="closeDialog"></edit-test-template>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction==='Delete'">
        <v-card-title class="text-h5">Are you sure you want to delete this test template? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteTestTemplate">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </v-main>
</template>

<script>
import AddTestTemplate from "@/components/Evaluator/AddTestTemplate";
import ShowTestTemplate from "@/components/Evaluator/ShowTestTemplate";
import EditTestTemplate from "@/components/Evaluator/EditTestTemplate";
export default {
  name: "TestTemplatesTable",
  components: {EditTestTemplate, ShowTestTemplate, AddTestTemplate},
  data() {
    return {
      testTemplates: [],
      search: "",
      loading: true,
      dialogAction: "Show",
      dialog: false,
      dialogIndex: 0,
      showIndex: 0,
      addIndex: 0,
      editIndex: 0,
      userCourses: [],
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'Course', value: 'course'},
        { text: 'Topics', value: 'topics'},
        { text: 'N° of Questions', value: 'tot'},
        { text: 'Available Minutes', value: 'availableMinutes'},
        { text: 'Passing Grade', value: 'passingGrade'},
        { text: 'Creator', value: 'creator'}
      ],
      testTemplateToHandle: {
        _id:"",
        title:"",
        course:{_id:"",name:""},
        creator:"",
        template:[{topic:{_id:"",name:""},questionNumber:"",questionValue:""}]
      },
      topics: []
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
    await this.getTestTemplates();
  },
  methods: {
    getNumberOfQuestions(item)
    {
      const template = item.template
      let tot = 0

      for(const i in template)
      {
        tot += parseInt(template[i].questionNumber)
      }

      return tot
    },
    openDelete()
    {
      this.dialogIndex += 1
      this.dialogAction = "Delete"
      this.dialog = true;
    },
    editTestTemplate()
    {
      this.dialogIndex += 1
      this.dialogAction = "Edit"
      this.dialog = true;
      this.editIndex += 1;
    },
    deleteTestTemplate()
    {
      this.$axios.post('eval/delete-test-template',{
        _id:this.testTemplateToHandle._id
      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.closeDialog()
      }).catch((err)=>{
        return this.$nuxt.error({code:500,error:err})
      })
    },
    showTestTemplate(item)
    {
      this.dialogIndex += 1
      this.dialogAction = "Show"
      this.dialog = true;
      this.testTemplateToHandle = item;
      this.showIndex += 1;

    },
    addTestTemplate() {
      this.dialogIndex += 1
      this.dialogAction= "Add"
      this.dialog = true
      this.addIndex += 1;
    },
    async closeDialog() {
      this.dialogIndex += 1
      this.dialog = false
      await this.getTestTemplates()
    },

    async getTestTemplates()
    {
      this.loading = true
      try{
        const testTemplates = await this.$axios.post('eval/get-test-templates', {
          courses: this.userCoursesIds

        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.testTemplates = testTemplates.data
        this.loading = false
      }
      catch (e) {
        return this.$nuxt.error({ code: 500, error: 'General Error' })
      }
    },
    getTopicsNames(item)
    {
      const template = item.template
      const topicsNames = []

      for(const i in template)
      {
        topicsNames.push(template[i].topic.name)
      }

      return topicsNames
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
        this.$nuxt.error({ code: 500, error: 'General Error' })
      }
    },
  },
}
</script>

<style scoped>

</style>
