<template>
<v-main>
  <AnswerQuestions></AnswerQuestions>
</v-main>
</template>

<script>
export default {
  name: "TestPage",
  layout: "test",
  asyncData(context) {

    if (context.store.getters.isSustained) {
      context.redirect("results")
    }
  },
}
</script>

<style scoped>

</style>
