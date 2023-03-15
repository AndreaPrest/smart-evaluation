export const state = () => ({

  user: {
    role:  "",
    email:"",
    loggedIn:false,
  }
})

export const mutations = {
  setUser(state, user) {
    state.user.role = user.role
    state.user.email = user.email
    state.user.loggedIn = true
  },
  removeUser(state) {
    state.user.role = ""
    state.user.email = ""
    state.user.loggedIn = false
  }
}

export const getters = {
  getUserRole(state) {
    return state.user.role
  },
  getUserEmail(state) {
    return state.user.email
  },
  userIsLogged(state){
    return state.user.loggedIn
  },
  getUser(state)
  {
    return state.user
  }
}

export const actions = {
  setUser({commit}, user) {
    commit('setUser', user)
  },
  removeUser({commit}) {
    commit('removeUser')
  }
}
