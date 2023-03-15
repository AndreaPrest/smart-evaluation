<template>
  <div>
    <edit-quiz v-if="questionType==='Quiz'" :quiz-to-edit="question" @quiz-edited="editSuccess"></edit-quiz>
    <edit-s-q-l v-if="questionType==='SQL'" :sql-to-edit="question" @sql-edited="editSuccess"></edit-s-q-l>
    <edit-code v-if="questionType==='Code'" :code-to-edit="question" @code-edited="editSuccess"></edit-code>
  </div>
</template>

<script>
import EditQuiz from "@/components/Evaluator/EditQuestionsTypes/EditQuiz";
import EditSQL from "@/components/Evaluator/EditQuestionsTypes/EditSQL";
import EditCode from "@/components/Evaluator/EditQuestionsTypes/EditCode";
export default {
  name: "EditQuestion",
  components: {EditSQL, EditQuiz, EditCode},
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
  methods: {
    editSuccess() {
      this.$emit('question-edited')
    }
  },
}
</script>

<style scoped>

</style>
