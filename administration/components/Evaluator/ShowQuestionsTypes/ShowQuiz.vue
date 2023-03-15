<template>
<div>
  <h3>Question:</h3>
  <div v-html="parsedRichText"></div>
  <h3>Answers:</h3>
  <ul v-for="(answer, index) in quiz.content.answers" :key="index">
    <li>{{ answer.answerText }} <v-icon v-if="quiz.content.correctAnswers.includes(index)">mdi-check</v-icon></li>
  </ul>
</div>
</template>

<script>
export default {
  name: "ShowQuiz",
  props: {
    question: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      quiz: this.question
    }
  },
  computed: {
    parsedRichText() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.quiz.question, "text/html");
      const imgs = doc.querySelectorAll("img");
      imgs.forEach(img => {
        img.style.maxWidth = "100%";
        img.style.height = "100%";
      });
      return doc.body.innerHTML;
    }
  },
}
</script>

<style scoped>

</style>
