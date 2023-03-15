<template>
  <v-app>
    <topic-list></topic-list>
  </v-app>
</template>

<script>
import TopicList from "@/components/Evaluator/TopicList";

export default {
  name: "TopicsPage",
  components:{TopicList},
  middleware: 'evaluatorAuth'
}
</script>

<style scoped>

</style>
