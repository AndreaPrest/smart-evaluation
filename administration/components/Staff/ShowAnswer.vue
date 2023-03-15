<template>
<div>
  <br>
  <show-answer-code v-if="questionType === 'Code'" :question="question" :question-number="questionNumber"></show-answer-code>
  <show-answer-s-q-l v-if="questionType === 'SQL'" :question="question" :question-number="questionNumber"></show-answer-s-q-l>
  <show-answer-quiz v-if="questionType === 'Quiz'" :question="question" :question-number="questionNumber"></show-answer-quiz>
</div>
</template>

<script>
import ShowAnswerCode from "@/components/Staff/ShowAnswersTypes/ShowAnswerCode";
import ShowAnswerSQL from "@/components/Staff/ShowAnswersTypes/ShowAnswerSQL";
import ShowAnswerQuiz from "@/components/Staff/ShowAnswersTypes/ShowAnswerQuiz";
export default {
  name: "ShowAnswer",
  components: {ShowAnswerQuiz, ShowAnswerSQL, ShowAnswerCode},
  props: {
    question: {
      type: Object,
      required: true
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    questionType: {
      type: String,
      required: true
    }
  },
}
</script>

<style scoped>

</style>
