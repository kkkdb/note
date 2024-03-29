/*
  插入排序的原理如下。第一个元素默认是已排序元素，取出下一个元素和当前元素比较，如果当前元素大就交换位置。
  那么此时第一个元素就是当前的最小数，所以下次取出操作从第三个元素开始，向前对比，重复之前的操作。
*/
let arr = [5, 2, 6, 1, 3, 4];
function insertion(arr) {
  if (!Array.isArray(arr)) return;
  for (let i = 1; i < arr.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j + 1] < arr[j]) swap(arr, j, j + 1);
    }
  }
}
function swap(arr, i, j) {
  let rightValue = arr[j];
  arr[j] = arr[i];
  arr[i] = rightValue;
}
insertion(arr);
console.log(arr);
