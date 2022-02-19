<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
  <span>test scss</span>
  <div class="father">
    <div class="son"></div>
  </div>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped lang="scss">
a {
  color: #42b983;
}
.father {
  width: 100px;
  height: 100px;
  background-color: pink;
  .son {
    width: 50px;
    height: 50px;
    background-color: blue;
  }
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
