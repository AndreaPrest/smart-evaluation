<template>
<TestsTable></TestsTable>
</template>

<script>
import TestsTable from "@/components/Staff/TestsTable";
export default {
  name: "TestsPage",
  components: {TestsTable},
  middleware: 'staffAuth'
}
</script>

<style scoped>

</style>
