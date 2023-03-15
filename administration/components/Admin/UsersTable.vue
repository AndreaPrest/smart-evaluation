<template>
  <v-main>
    <v-data-table
    :headers="headers"
    :items="users"
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
              <span class="text-h5">Add User</span>
            </v-card-title>
            <v-card-text>
              <add-user :key="addKey" @userAdded="closeDialog"></add-user>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogEdit"
          max-width="800px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit User</span>
            </v-card-title>
            <v-card-text>
              <edit-user :key="editKey" :old-courses="getCoursesNames(editedItem.courses)" :old-roles="editedItem.roles" :old-email="editedItem.email" @userEdited="closeDialog"></edit-user>
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
          Add User
        </v-btn>
        </div>
      </v-toolbar>
      <v-dialog v-model="dialogDelete" max-width="800px">
        <v-card>
          <v-card-title class="text-h5">Are you sure you want to delete the user <br> {{ editedItem.email }} ?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">Delete</v-btn>
            <v-btn color="blue darken-1" text @click="closeDelete">Back</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
      <template #[`item.courses`] = "{ item }">

      {{ getCoursesNames(item.courses).toString() }}

      </template>

      <template #[`item.actions`]="{ item }">

        <v-icon
          small
          class="mr-2"
          @click="editElement(item,users)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="$auth.user.email !== item.email"
          small
          class="mr-2"
          @click="deleteElement(item,users)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-main>
</template>

<script>
import AddUser from "@/components/Admin/AddUser";
import EditUser from "@/components/Admin/EditUser";
import adminTablesMixin from "@/mixins/adminTablesMixin";
export default {
  name: "UsersTable",
  components: {EditUser, AddUser},
  mixins: [adminTablesMixin],
  data() {
    return {
      users: [],
      headers: [
        {
          text: 'Email',
          align: 'start',
          sortable: false,
          value: 'email',
        },
        { text: 'Roles', value: 'roles' },
        { text: 'Courses', value: 'courses'},
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        _id: '',
        email:'',
        roles:[],
        courses:[],
      },
      defaultItem: {
        _id: '',
        email:'',
        roles:[],
        courses:[],
      },
    }
  },
  async mounted() {
    await this.getUsers()
  },

  methods: {
    getCoursesNames(courses)
    {
      return courses.map(course => {return course.name})
    },
    async closeDialog()
    {
      await this.getUsers()
      this.dialogEdit = false;
      this.dialogAdd = false;
    },
    async getUsers() {
      this.loading = true
      try{
        const users = await this.$axios.get('admin/get-users', {
          headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
        })
        this.users = users.data
        this.loading = false
      }
      catch (e) {
        return this.$nuxt.error({ statusCode: 500, message: 'General Error' })
      }

    },

    deleteItemConfirm()
    {
      this.$axios.post('admin/delete-user',{
        _id:this.editedItem._id
        },{
        headers: {
            'Authorization': this.$auth.strategy.token.get(),
          }
      }).then((res)=>{
        this.users.splice(this.editedIndex, 1)
        this.closeDelete()
        }).catch((err)=>{
          return this.$nuxt.error({statusCode:500,message:err})
      })

    }
  },
}
</script>

<style scoped>

</style>
