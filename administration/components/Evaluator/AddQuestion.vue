<template>
<div>
  <add-quiz v-if="questionType==='Quiz'" @quiz-added="addSuccess"></add-quiz>
  <add-s-q-l v-if="questionType === 'SQL'" @sql-added="addSuccess"></add-s-q-l>
  <add-code v-if="questionType === 'Code'"  @code-added="addSuccess"></add-code>
</div>
</template>

<script>
import AddCode from "@/components/Evaluator/AddQuestionsType/AddCode";
import AddSQL from "@/components/Evaluator/AddQuestionsType/AddSQL";
import AddQuiz from "@/components/Evaluator/AddQuestionsType/AddQuiz";

export default {
  name: "AddQuestion",
  components: {
    AddSQL,
    AddCode,
    AddQuiz,
  },
  props: {
    questionType: {
      type: String,
      required: true
    },
  },
  methods: {
    addSuccess() {
      this.$emit('question-added')
    }

  }
}
</script>

<style scoped>

</style>
