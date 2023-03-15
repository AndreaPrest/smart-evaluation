<template>
  <v-main>
    <v-data-table
      :headers="headers"
      :items="courses"
      :search="search"
      :loading="loading"
      loading-text="Loading... Please wait"
    ><template #top>
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
        <v-dialog
          v-model="dialogAdd"
          max-width="800px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Course</span>
            </v-card-title>
            <v-card-text>
              <add-course :key="addKey" @courseAdded="closeDialog"></add-course>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogEdit"
          max-width="800px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h6">Edit Course</span>
            </v-card-title>
            <v-card-text>
              <edit-course :id="editedItem._id" :key="editKey" :old-name="editedItem.name" @courseEdited="closeDialog"></edit-course>
            </v-card-text>
          </v-card>
        </v-dialog>
        <div class="align-center">
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="addElement"
          >
            Add Course
          </v-btn>
        </div>
      </v-toolbar>
      <v-dialog v-model="dialogDelete" max-width="800px">
        <v-card>
          <v-card-title class="text-h6">
            Are you sure you want to delete the course <br> {{ editedItem.name }} ?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editElement(item,courses)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="item.name !== $auth.user.course"
          small
          @click="deleteElement(item,courses)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-main>
</template>

<script>
import EditCourse from "@/components/Admin/EditCourse";
import AddCourse from "@/components/Admin/AddCourse";
import adminTablesMixin from "@/mixins/adminTablesMixin";
export default {
  name: "CoursesTable",
  components: {AddCourse, EditCourse},
  mixins: [adminTablesMixin],
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      courses: [],
      editedIndex: -1,
      editedItem: {
        _id: '',
        name:''
      },
      defaultItem: {
        _id: '',
        name:''
      },
    }
  },
  async mounted() {
    await this.getCourses()
  },
  methods: {
    async closeDialog()
    {
      await this.getCourses()
      this.dialogAdd = false;
      this.dialogEdit = false;
    },
    async getCourses()
    {
      this.loading = true
      try{
        const courses = await this.$axios.get('admin/get-courses', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.courses = courses.data
      }
      catch (e)
      {
        this.$nuxt.error({ statusCode: 500, message: 'General Error' })
      }

      this.loading = false
    },
    deleteItemConfirm()
    {
      this.$axios.post('admin/delete-course',{
        _id:this.editedItem._id
      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.courses.splice(this.editedIndex, 1)
        this.closeDelete()
      }).catch((err)=>{
        return this.$nuxt.error({statusCode:500, message:err})
      })

    }
  },
}
</script>

<style scoped>

</style>
