import { ref, computed } from "vue"
export default function userHook(initValue = 1) {
    const count = ref(initValue);
    const multiple = computed(() => count.value * 2)
    const add = (num) => {
        if(typeof(num) === Number){
            count.value += num
        }else{
            count.value++
        }
    }
    const reduce = (num ) => {
        if(typeof(num) === Number){
            count.value -= num
        }else{
            count.value--
        }
    }
    return {
        count,
        multiple,
        add,
        reduce
    }
}