<template>
  <v-main>
    <v-dialog v-model="dialogDelete" max-width="800px">
      <v-card>
        <v-card-title class="text-h6">
          Are you sure you want to delete this topic?
        </v-card-title>
        <v-card-text class="text-h7 red--text">
          All the children topics will be deleted
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogEdit"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6">Edit Topic</span>
        </v-card-title>
        <v-card-text>
          <edit-topic :key="editKey" :topic-id="selectedItem._id" :old-name="selectedItem.name" @topic-edited="closeDialog"></edit-topic>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogAdd"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6">Add Child Topic</span>
        </v-card-title>
        <v-card-text>
          <add-topic :key="addKey" :parent-name="selectedItem.name" :parent-id="selectedItem._id" @topic-added="closeDialog"></add-topic>
        </v-card-text>
      </v-card>
    </v-dialog>
  <v-sheet class="pa-4 dark">
    <v-text-field
      v-model="search"
      label="Search Topic"
      dark
      flat
      solo-inverted
      hide-details
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>
  </v-sheet>
  <v-treeview
      :open.sync="flatTopicsTree"
      open-all
      :items="topics"
      :search="search"
      hoverable
  >
    <template slot="label" slot-scope="{ item }">
      <div>
        <a style="color: white">{{ item.name }}</a>
        <v-icon @click="addTopic(item)">mdi-plus</v-icon>
        <v-icon v-if="item.name !== 'Root'" @click="deleteTopic(item,topics)">mdi-delete</v-icon>
        <v-icon v-if="item.name !== 'Root'" @click="editTopic(item,topics)">mdi-pencil</v-icon>
      </div>
    </template>
  </v-treeview>
  </v-main>
</template>

<script>
import AddTopic from "@/components/Evaluator/AddTopic";
import EditTopic from "@/components/Evaluator/EditTopic";
export default {
  name: "TopicList",
  components: {EditTopic, AddTopic},
  data: () => ({
    dialogDelete: false,
    dialogEdit: false,
    dialogAdd: false,
    topics: [],
    search: '',
    flatTopicsTree: [],
    selectedItem: {
      name: "",
      _id: ""
    },
    baseItem: {
      name: "",
      _id: ""
    },
    addKey:0,
    editKey:0
  }),
  computed: {
    topicNames() {
      return this.topics.name
    }
  },

  async mounted() {
    await this.getTopics()
    this.flatTopicsTree = this.flattenTree(this.topics)
  },
  methods: {
    closeDialog()
    {
      this.dialogAdd = false;
      this.dialogEdit = false;
      this.getTopics()
    },
    editTopic(item)
    {
      this.dialogEdit = true;
      this.selectedItem = item;
      this.editKey += 1;
    },

    addTopic(item)
    {
      this.dialogAdd = true;
      this.selectedItem = item;
      this.addKey += 1;
    },

    // Delete Functions
    deleteTopic(item)
    {
      this.selectedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async closeDelete() {
      await this.getTopics()
      this.selectedItem = this.baseItem
      this.dialogDelete = false;
    },
    deleteItemConfirm()
    {
      this.$axios.post('eval/delete-topic',{
        _id:this.selectedItem._id
      },{
        headers: {
          'Authorization': this.$auth.strategy.token.get(),
        }
      }).then((res)=>{
        this.closeDelete()
      }).catch((err)=>{
        return this.$nuxt.error({statusCode:500, message:err})
      })
    },

    async getTopics()
    {
      try{
        const topics = await this.$axios.get('eval/get-topics-tree', {
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
    flattenTree(tree) {
      const flatArray = [];
      function traverse(node) {
        flatArray.push(node.name);
        if (node.children) {
          node.children.forEach(child => traverse(child));
        }
      }
      traverse(tree);
      return flatArray;
  }


},

}
</script>

<style scoped>
a{
  color: white;
}
</style>
