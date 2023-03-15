<template>
  <v-card
    style="margin-top: 5%"
    class="container">
    <v-card-title>
      Question n° {{ questionNumber + 1}}
    </v-card-title>
    <v-card-text>
      <div v-html="parsedRichText">
      </div>
      <AnswerQuiz v-if="questionType === 'Quiz'" :key="showKey" :content="questionContent"></AnswerQuiz>
      <AnswerSQL v-if="questionType === 'SQL'"  :key="showKey + 1" :content="questionContent"></AnswerSQL>
      <AnswerCode v-if="questionType === 'Code'" :key="showKey + 2" :content="questionContent"></AnswerCode>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="!isFirstQuestion" color="warning" @click="previousQuestion">
        Prev
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="!isLastQuestion" color="primary" @click="nextQuestion" >
        Next
      </v-btn>
      <v-btn v-if="isLastQuestion" color="green"  @click="submitTest" >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AnswerQuiz from "@/components/AnswerQuestionsTypes/AnswerQuiz";
import AnswerSQL from "@/components/AnswerQuestionsTypes/AnswerSQL";
import AnswerCode from "@/components/AnswerQuestionsTypes/AnswerCode";
export default {
  name: "AnswerQuestion",
  components: {AnswerCode, AnswerSQL, AnswerQuiz},
  data() {
    return {
      question: {},
      showKey: 0,
    }
  },  computed: {
    questionNumber() {
      return this.$store.getters.getProgress
    },
    questionText()
    {
      return this.$store.getters.getCurrentQuestionText
    },
    questionContent()
    {
      return this.$store.getters.getCurrentQuestionContent
    },
    questionType()
    {
      return this.$store.getters.getCurrentQuestionType
    },
    isLastQuestion() {
      return this.$store.getters.isLastQuestion
    },
    isFirstQuestion() {
      return this.$store.getters.isFirstQuestion
    },
    parsedRichText() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.questionText, "text/html");
      const imgs = doc.querySelectorAll("img");
      imgs.forEach(img => {
        img.style.maxWidth = "100%";
        img.style.height = "100%";
      });
      return doc.body.innerHTML;
    },
  },

  methods: {
    nextQuestion() {
      this.$store.dispatch('nextQuestion')
      this.showKey++
    },
    previousQuestion() {
      this.$store.dispatch('previousQuestion')
      this.showKey--
    },
    submitTest() {
      this.$store.dispatch("setSustainedToTrue")
      this.$router.push("results")
    }
  },

}
</script>

<style scoped>
</style>
