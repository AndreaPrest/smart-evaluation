<template>
  <v-card elevation="8">
    <v-card-title>
      Question n° {{ questionNumber + 1 }}
    </v-card-title>
    <v-card-text>
      <h3>Question:</h3>
      <div v-html="parsedRichText">
      </div>
      <h3>Candidate Answer:</h3>
      <ul v-for="(answer, index) in question.question.content.answers" :key="'candidate' + index">
        <li>{{ answer.answerText }} <v-icon v-if="response(question.response).includes(index)">mdi-check</v-icon></li>
      </ul>
      <h3>Correct Answer:</h3>
      <ul v-for="(answer, index) in question.question.content.answers" :key="'correct' + index">
        <li>{{ answer.answerText }} <v-icon v-if="question.question.content.correctAnswers.includes(index)">mdi-check</v-icon></li>
      </ul>
      <br>
      <h3>Evaluation:</h3>
      <p>{{evaluation}}</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ShowAnswerQuiz",
  props: {
    questionNumber: {
      type: Number,
      required: true
    },
    question: {
      type: Object,
      required: true
    },
  },
  computed: {
    evaluation()
    {
      return this.roundNum(this.question.evaluation) + "/" + this.roundNum(this.question.value)
    },
    parsedRichText() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.question.question.question, "text/html");
      const imgs = doc.querySelectorAll("img");
      imgs.forEach(img => {
        img.style.maxWidth = "100%";
        img.style.height = "100%";
      });
      return doc.body.innerHTML;
    },
  },
  methods: {

    response(response) {
      return response !== null ? response : []
    },
    roundNum(num)
    {
      return num % 1 !== 0 ? num.toFixed(2) : num
    }
  },
}
</script>

<style scoped>

</style>
