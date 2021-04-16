//冒泡排序，从第一个开始，比较当前和下一个大小，把小的放前面，大的放后面。第一轮比较下来最大的就在最后面，继续下一轮，一直到从小到大排序
let arr = [5, 2, 6, 1, 3, 4];
function bubble(arr) {
  if (!Array.isArray(arr)) return;
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) swap(arr, j, j + 1);
    }
  }
  return arr;
}
function swap(arr, i, j) {
  let rightValue = arr[j];
  arr[j] = arr[i];
  arr[i] = rightValue;
}
bubble(arr);
console.log(arr);

let arr2 = [5, 2, 6, 1, 3, 4];
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}
bubbleSort(arr2);
console.log(arr2);
