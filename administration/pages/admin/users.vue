<template>
<users-table/>
</template>

<script>
import UsersTable from "@/components/Admin/UsersTable";
export default {
  name: "UsersPage",
  components: {UsersTable},
  middleware: 'adminAuth',
}
</script>

<style scoped>

</style>
