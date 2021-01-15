<template>
  <moveSettings><div></div></moveSettings>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import moveSettings from "@/components/common/moveAlert/moveSettings.vue";
export default defineComponent({
  name: "manageGroups",
  components: {
    moveSettings
  }
});
</script>
<style scoped></style>
