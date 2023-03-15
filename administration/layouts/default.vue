<template>
  <v-app dark>
    <v-app-bar
      app
      elevation="4"
      dense
    >
      <v-app-bar-nav-icon v-show="isLogged" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="$router.push('/')">Smart Evaluation</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-show="!isLogged"
        color="primary"
        @click='goToLogin'
      >Login
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
        >
          <v-list-item
            v-for="item in roleMenu" :key="item.title" @click="$router.push(item.link)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block @click='logout'>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <Nuxt/>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false,
      menu: [
        {title: "Home", link: "/", icon: "mdi-home",role:"all"},
        {title: "Users", link: "/admin/users",icon:"mdi-account-multiple",role:"Administrator"},
        {title: "Courses", link: "/admin/courses",icon: "mdi-school",role:"Administrator"},
        {title: "Test Template", link: "/evaluator/testtemplates",icon: "mdi-dropbox",role:"Evaluator"},
        {title: "Tests", link: "/staff/tests",icon: "mdi-book-edit-outline",role:"Staff"},
        {title: "Questions", link: "/evaluator/questions",icon: "mdi-file-question-outline",role:"Evaluator"},
        {title: "My Questions", link: "/evaluator/myquestions",icon: "mdi-file-question",role:"Evaluator"},
        {title: "Topics", link: "/evaluator/topics",icon: "mdi-family-tree",role:"Evaluator"},

      ],
      group:""
    }
  },

  computed: {
    roleMenu()
    {
      if(!this.$auth.user)
      {
        return false
      }
      else
      {
        return this.menu.filter(e => this.$auth.user.roles.includes(e.role) || e.role === "all")
      }

    },
    isLogged()
    {
      if(!this.$auth.user)
      {
        return false
      }
      else {
        return this.$auth.loggedIn
      }
    }
  },
  methods: {
    logout()
    {
      this.$auth.logout().then(()=> {
        this.$router.push('/')
        this.drawer = false
      })
    },
    goToLogin()
    {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
