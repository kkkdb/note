<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <!-- <Demo></Demo> -->
  <p>count: {{ count }}</p>
  <p>multiple:{{ multiple }}</p>
  <button @click="add">加1</button>
  <button @click="reduce">减1</button>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Demo from "./components/Demo.vue";
import userCount from "./hook/userCount";

export default {
  name: "App",
  components: {
    // HelloWorld,
    // Demo,
  },
  setup() {
    const { count, multiple, add, reduce } = userCount(10);
    return {
      count,
      multiple,
      add,
      reduce,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
