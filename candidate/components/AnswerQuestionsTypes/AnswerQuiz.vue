<template>
<div>
  <div v-for="(answer, index) in answers" :key="index">
    <v-checkbox v-model="candidateAnswer" :value="index" :label="answer.answerText" @change="setAnswer"/>
  </div>
</div>
</template>

<script>
export default {
  name: "AnswerQuiz",
  props: {
    content: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      candidateAnswer: this.$store.getters.getResponse  ? this.$store.getters.getResponse: []
    }
  },
  computed: {
    answers() {
      return this.content.answers
    }
  },
  methods: {
    setAnswer() {
      this.$store.dispatch('setResponse', this.candidateAnswer)
    }
  },
}
</script>

<style scoped>

</style>
