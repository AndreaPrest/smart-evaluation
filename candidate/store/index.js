export const state = () => ({
  id:"",
  test: null,
  progress: 0,
  sustained: false,
  availableMinutes: 0,
  availableSeconds: 0,
  token:"",
  finalEvaluation: 0,
  passingGrade: 0,
  submitted: false
})

export const getters = {
  getProgress(state) {
    return  state.progress
  },
  isLastQuestion(state)
  {
    return  state.progress === state.test.test.length - 1
  },
  isFirstQuestion(state)
  {
    return  state.progress === 0
  },
  getCurrentQuestion(state)
  {
    return state.test.test[state.progress]
  },
  getCurrentQuestionText(state)
  {
    return state.test.test[state.progress].question.question
  },
  getCurrentQuestionContent(state)
  {
    return state.test.test[state.progress].question.content
  },
  getCurrentQuestionType(state)
  {
    return state.test.test[state.progress].type
  },
  getTest(state)
  {
    return state.test
  },
  getId(state)
  {
    return state.test.id
  },
  getFinalEvaluation(state)
  {
    return state.test.finalEvaluation
  },
  isSustained(state)
  {
    return state.sustained
  },
  getAvailableMinutes(state)
  {
    return state.availableMinutes
  },
  getAvailableSeconds(state)
  {
    return parseInt(state.availableSeconds)
  },
  getJWT(state)
  {
    return state.token
  },
  getResponse(state)
  {
    return state.test.test[state.progress].response
  },
  getPassingGrade(state)
  {
    return state.passingGrade
  },
  getSubmitted(state)
  {
    return state.submitted
  }
}

export const mutations = {
  incrementProgress(state) {
    state.progress++
  },
  decrementProgress(state) {
    state.progress--
  },
  setTest(state,test)
  {
    state.test = test
  },
  setId(state,id)
  {
    state.id = id
  },
  setResponse(state, response)
  {
    state.test.test[state.progress].response = response
  },
  setFinalEvaluation(state,evaluation)
  {
    state.finalEvaluation = evaluation
  },
  setSustainedToTrue(state)
  {
    state.sustained = true
  },
  setMinutesLeft(state,min)
  {
    state.availableMinutes = min
  },
  setSecondsLeft(state,sec)
  {
    state.availableSeconds = sec
  },
  reset(state)
  {
    Object.assign(state, initialState())
  },
  setJWT(state,token)
  {
    state.token = token
  },
  setPassingGrade(state,grade)
  {
    state.passingGrade = grade
  },
  setSubmittedToTrue(state)
  {
    state.submitted = true;
  },

}

export const actions = {
  nextQuestion({ commit }){
    commit('incrementProgress')
  },
  previousQuestion({  commit }){
    commit('decrementProgress')
  },
  setTest({  commit }, value){
    commit('setTest',value)
  },
  setId({  commit }, value){
    commit('setId',value)
  },
  setResponse({commit}, value)
  {
    commit('setResponse', value)
  },
  setFinalEvaluation({commit}, value)
  {
    commit('setFinalEvaluation', value)
  },
  setSustainedToTrue({commit}) {
    commit('setSustainedToTrue')
  },
  setAvailableMinutes({commit}, value)
  {
    commit('setMinutesLeft', value)
  },
  setAvailableSeconds({commit}, value)
  {
    commit('setSecondsLeft', value)
  },
  resetStore({ commit }) {
    commit('reset')
  },
  setToken({commit}, value)
  {
    commit('setJWT', value)
  },
  setPassingGrade({commit}, grade) {
    commit('setPassingGrade',grade)
  },
  setSubmittedToTrue({commit}) {
    commit('setSubmittedToTrue')
  }
}

function initialState() {
  return {
    id:"",
    test: null,
    progress: 0,
    sustained: false,
    finalEvaluation: 0,
    availableMinutes: 30,
    availableSeconds: 0,
    token: "",
    passingGrade: 0,
    submitted: false,
  }
}
