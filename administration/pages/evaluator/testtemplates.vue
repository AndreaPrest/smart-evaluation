<template>
  <v-app>
      <TestTemplatesTable></TestTemplatesTable>
  </v-app>
</template>

<script>
import TestTemplatesTable from "@/components/Evaluator/TestTemplatesTable";
export default {
  name: "testTemplates",
  components: {TestTemplatesTable},
  middleware: 'evaluatorAuth'
}
</script>

<style scoped>

</style>
