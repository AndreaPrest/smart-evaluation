export default{
  data() {
    return {
      dialogAdd:false,
      search: '',
      loading: true,
      dialogDelete: false,
      dialogEdit:false,
      editKey: 0,
      addKey: 0
    }
  },

  methods: {
    closeDelete()
    {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    deleteElement(item,collection) {
      this.editedIndex = collection.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    editElement(item,collection) {
      this.editKey += 1
      this.editedIndex = collection.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },

    addElement()
    {
      this.dialogAdd = true;
      this.addKey += 1;
    }
  },
}
