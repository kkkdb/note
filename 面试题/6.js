//给定一个升序整型数组[0,1,2,4,5,7,13,15,16],找出其中连续出现的数字区间，输出为["0->2","4->5","7","13","15->16"]
function summaryRanges(arr) {
  let start = 0,
    num = 1;
  while (start < arr.length) {
    while (arr[start + num] - arr[start] === num) {
      num++;
    }
    if (num !== 1) {
      arr.splice(start, num, `${arr[start]}=>${arr[start + num - 1]}`);
    }
    start++;
    num = 1;
  }
  return arr;
}

console.log(summaryRanges([0, 1, 2, 4, 5, 7, 13, 15, 16]));
