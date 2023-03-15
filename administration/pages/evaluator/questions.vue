<template>
<courses-questions-table/>
</template>

<script>
import CoursesQuestionsTable from "@/components/Evaluator/CoursesQuestionsTable";
export default {
  name: "AllQuestions",
  components: {CoursesQuestionsTable},
  middleware: 'evaluatorAuth'
}
</script>

<style scoped>

</style>
