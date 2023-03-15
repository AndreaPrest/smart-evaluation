<template>
  <v-app>
<courses-table></courses-table>
  </v-app>
</template>

<script>
import CoursesTable from "@/components/Admin/CoursesTable";
export default {
  name: "CoursesPage",
  components: {CoursesTable},
  middleware: 'adminAuth',
}
</script>

<style scoped>

</style>
