<template>
  <v-main>
    <v-data-table
      :headers="headers"
      :items="tests"
      :search="search"
      :loading="loading"
      loading-text="Loading... Please wait"
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
            @click="addTest"
          >
            Add Tests
          </v-btn>
            <v-btn
              color="green"
              dark
              class="mb-2"
              @click="exportCSV"
            >
              Export to CSV
            </v-btn>

          </div>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">

        <v-icon
          small
          @click="openDelete(item)"
        >
          mdi-delete
        </v-icon>

        <v-icon
          v-if="item.sustained"
          small
          @click="showTest(item)"
        >
          mdi-eye
        </v-icon>
      </template>
      <template #[`item.template`]="{ item }">

        {{ item.template ? item.template.title : "Deleted" }}

      </template>
      <template #[`item.course`]="{ item }">

      {{ getCourseName(item.course) }}

      </template>

      <template #[`item.creationDate`]="{ item }">

      {{ formatDate(item.creationDate) }}

      </template>

      <template #[`item.expirationDate`]="{ item }">

        {{ formatDate(item.expirationDate) }}

      </template>

      <template #[`item.sustained`]="{ item }">

        {{ item.sustained ? "Yes" : "No" }}

      </template>

      <template #[`item.finalEvaluation`]="{ item }">

        {{ item.sustained ? roundNum(item.finalEvaluation) : "" }}

      </template>

      <template #[`item.passed`]="{ item }">

        {{ testPassed(item) }}

      </template>
    </v-data-table>

    <v-dialog
      :key="dialogIndex"
      v-model="dialog"
      max-width="800px">

      <v-card v-if="dialogAction==='Show'">
        <v-card-title>
          <span class="text-h6">Test Results</span>
        </v-card-title>
        <v-card-text>
          <show-test :test-to-show="selectedItem"></show-test>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction ==='Add'">
        <v-card-title>
          <span class="text-h6">Add Test</span>
        </v-card-title>
        <v-card-text>
          <AddTest @test-added="closeDialog"></AddTest>
        </v-card-text>
      </v-card>

      <v-card v-if="dialogAction==='Delete'">
        <v-card-title class="text-h5">Are you sure you want to delete this test? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteTest">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </v-main>
</template>

<script>
import Papa from 'papaparse'
import AddTest from "@/components/Staff/AddTest";
import ShowTest from "@/components/Staff/ShowTest";
export default {
  name: "TestsTable",
  components: {ShowTest, AddTest},
  data() {
    return {
      headers: [
        {
          text: 'Code',
          align: 'start',
          sortable: false,
          value: 'code',
        },
        { text: 'Course', value: 'course'},
        { text: 'Template', value: 'template'},
        { text: 'Creation Date (Y-M-D)', value: 'creationDate'},
        { text: 'Expiration Date (Y-M-D)', value: 'expirationDate'},
        { text: 'Sustained', value: 'sustained'},
        { text: 'Score', value: 'finalEvaluation'},
        { text: 'Passed', value: 'passed'},
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      search:"",
      loading: true,
      tests: [],
      dialog:false,
      dialogIndex:0,
      showIndex: 0,
      addIndex: 0,
      dialogAction: "Show",
      userCourses: [],
      selectedItem: {}
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
    await this.getTests();
  },
  methods: {
    roundNum(num)
    {
      return num % 1 !== 0 ? num.toFixed(2) : num
    },
    testPassed(item) {
      if(!item.sustained)
      {
        return ""
      }
      else if(item.finalEvaluation > item.passingGrade)
      {
        return "Yes"
      }
      else
      {
        return "No"
      }
    },
    async getTests() {
      this.loading = true
      try{
        const tests = await this.$axios.post('staff/get-tests', {
          courses: this.userCoursesIds

        },{
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.tests = tests.data
        this.loading = false
      }
      catch (e) {
        return this.$nuxt.error({ statusCode: 500, message: 'General Error' })
      }
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
    addTest() {
      this.dialogIndex += 1
      this.dialogAction= "Add"
      this.dialog = true
      this.addIndex += 1;
    },
    async closeDialog() {
      this.dialogIndex += 1
      this.dialog = false
      await this.getTests()
    },
    deleteTest() {
      this.$axios.post('staff/delete-test',{
        _id:this.selectedItem._id
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
    openDelete(item) {
      this.selectedItem = item
      this.dialogIndex += 1
      this.dialogAction = "Delete"
      this.dialog = true;
    },
    showTest(item) {
      this.dialogIndex += 1
      this.dialogAction = "Show"
      this.dialog = true;
      this.selectedItem = item;
      this.showIndex += 1;


    },
    getCourseName(courseId) {
      return this.userCourses.filter(v => v._id === courseId).map(v=>v.name)[0]
    },
    formatDate(date) {
      return date.substring(0, date.indexOf('T'));
    },
    exportCSV() {


      const csv = Papa.unparse({
        fields: ['Code','Template', 'Course', 'Creation Date', 'Expiration Date', 'Sustained', 'Final Evaluation'],
        data: this.tests.map(test => ({
          'Code': test.code,
          'Template': test.template ? test.template.title : 'Deleted',
          'Course': this.getCourseName(test.course),
          'Creation Date': this.formatDate(test.creationDate),
          'Expiration Date': this.formatDate(test.expirationDate),
          'Sustained': test.sustained ? 'Yes' : 'No',
          'Final Evaluation': test.sustained ? `${this.roundNum(test.finalEvaluation)}%` : '',
          'Passed': this.testPassed(test)
        })),
      })

      const link = document.createElement('a')
      link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
      link.download = this.getExportTitle()
      link.click()
    },
    getExportTitle()
    {
      const date = new Date();
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      const formattedDate = date.toLocaleDateString('en-US', options);
      return "Tests_" + formattedDate
    },
  },
}
</script>

<style scoped>

</style>
