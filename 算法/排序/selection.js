//选择排序
let arr = [5, 2, 6, 1, 3, 4];
function selection(arr) {
  if (!Array.isArray(arr)) return;
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[minIndex] > arr[j]) minIndex = j;
    }
    swap(arr, i, minIndex);
  }
}
function swap(arr, i, j) {
  let rightValue = arr[j];
  arr[j] = arr[i];
  arr[i] = rightValue;
}
selection(arr);
console.log(arr);
