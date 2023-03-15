<template>
  <div>
    <show-quiz v-if="questionType==='Quiz'" :question="question"></show-quiz>
    <show-s-q-l v-if="questionType==='SQL'" :question="question"></show-s-q-l>
    <show-code v-if="questionType==='Code'" :question="question"></show-code>
  </div>
</template>

<script>
import ShowQuiz from "@/components/Evaluator/ShowQuestionsTypes/ShowQuiz";
import ShowSQL from "~/components/Evaluator/ShowQuestionsTypes/ShowSQL";
import ShowCode from "@/components/Evaluator/ShowQuestionsTypes/ShowCode";
export default {
  name: "ShowQuestion",
  components: {ShowSQL, ShowQuiz, ShowCode},
  props: {
    questionType: {
      type: String,
      required: true
    },
    question: {
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped>

</style>
