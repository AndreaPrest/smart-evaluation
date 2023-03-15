<template>
  <div>
    <div v-for="(question,index) in test" :key="index">
      <show-answer :question-type="question.type" :question-number="index" :question="question"></show-answer>
    </div>
  </div>
</template>

<script>
import ShowAnswer from "@/components/Staff/ShowAnswer";
export default {
  name: "ShowTest",
  components: {ShowAnswer},
  props: {
    testToShow: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      test: this.testToShow.test
    }
  },
}
</script>

<style scoped>

</style>
