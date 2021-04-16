/**
 * 交换数组内部值位置
 * @param {*} arr
 * @param {*} start 想要换的位置
 * @param {*} end 要换到的位置
 * @param {Boolean} keepOld 是否保留原数组顺序
 * @returns {Array} _arr 交换后的数组
 */
function swipArrPosition(arr, start, end = start + 1, keepOld = false) {
  //加个DeepClone
  let _arr = keepOld ? JSON.parse(JSON.stringify(arr)) : arr;
  _arr.splice(end, 1, ..._arr.splice(start, 1, _arr[end]));
  return _arr;
}
// let arr = [1, 2, 3, 4, 5];
// console.log(swipArrPosition(arr, 1, 3, true));
// console.log(arr);



/**
 * 找到左边第一个比index上的值大的位置
 * @param { Array } list
 * @param { Number } index
 * @returns { Number } pos
 */
function getFisrtBigPos(list, index) {
  let pos = 0;
  let max = list[index],
    bigger; //最接近大的值
  for (let i = 0; i < index; i++) {
    if (list[i] > max) {
      max = list[i];
      if (!bigger) {
        bigger = list[i];
      }
    }
    if (list[i] > list[index] && list[i] <= bigger) {
      bigger = list[i];
      pos = i;
    }
  }
  return pos;
}

// let str = "22334421";
// let arr = str.split("");
// console.log(getFisrtBigPos(arr, 6));
