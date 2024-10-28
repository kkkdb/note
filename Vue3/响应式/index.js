let activeEffect = null;

const reactive = (obj) => {
  const effectMap = {};
  return new Proxy(obj, {
    get(target, key) {
      if (!effectMap[key]) {
        effectMap[key] = [];
      }
      if (activeEffect) {
        effectMap[key].push(activeEffect);
      }
      console.log("依赖收集", key, activeEffect);
      return target[key];
    },
    set(target, key, val) {
      target[key] = val;
      effectMap[key]?.forEach((fn) => fn());
      console.log("派发更新", key, val);
      return true;
    },
  });
};

const effect = (fn) => {
  activeEffect = fn;
  fn();
  activeEffect = null;
};

const ref = (value) => {
  return reactive({ value }); // ref 本质上就是reactive
};

export { reactive, effect, ref };
