<template>
  <div>首页</div>
  <globalVarVue></globalVarVue>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import globalVarVue from "@/test/testScss/globalVar.vue";
export default defineComponent({
  setup() {
    return {};
  },
  components: {
    globalVarVue,
  },
});
</script>
<style lang="scss" scoped></style>
