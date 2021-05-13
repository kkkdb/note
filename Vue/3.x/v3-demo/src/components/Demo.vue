<template>
  <div>第{{ year }}年</div>
  <div>姓名：{{ name }}</div>
  <div>年龄：{{ age }}岁</div>
</template>
<script>
import { reactive, ref, toRefs } from "vue";
export default {
  setup() {
    const year = ref(0);
    const user = reactive({ age: 18, name: "张三" });
    setInterval(() => {
      year.value++;
      user.age++;
    }, 1000);
    return {
      year,
      ...toRefs(user),
    };
  },
};
</script>