/**
 * @param {number} n
 * @return {number}
 */

/**
 * 下一个更大元素 III
 * 
 * 给你一个正整数 n ，请你找出符合条件的最小整数，其由重新排列 n 中存在的每位数字组成，并且其值大于 n 。如果不存在这样的正整数，则返回 -1 。
 * 注意 ，返回的整数应当是一个 32 位整数 ，如果存在满足题意的答案，但不是 32 位整数 ，同样返回 -1 。
 * 
 * 
 * 思路 1435 反过来就是5341 凑头遍历过去 如果前一个大于后一个，那一定存在那个整数。
 * 1435 => 5341 => 5>3 => pos=1 => 找到第一个比他大的值5在第0位 => 第0位和第1位换位 => 3541 => 0到0从大到小排序 => 3541 => 1453
 * 1453 => 3541 => 5>4 => pos=2 => 找到第一个比他大的值5在第1位 => 第2位和第1位换位 => 3451 => 0到1从大到小排序 => 4351 => 1534
 * 230241 => 142032 => 4>2 => pos=2 => 找到第一个比他大的值6在第0位 => 第2位和第0位换位 => 4863 => 0到1从大到小排序 => 8463 => 3648
 */
var nextGreaterElement = function (n) {
  function swipArrPosition(arr, start, end = start + 1, keepOld = false) {
    let _arr = keepOld ? JSON.parse(JSON.stringify(arr)) : arr;
    _arr.splice(end, 1, ..._arr.splice(start, 1, _arr[end]));
    return _arr;
  }
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
  let list = String(n).split("").reverse();
  let pos = -1;
  //找到不按顺序排列的那个位置pos
  for (let i = 0; i < list.length; i++) {
    if (list[i] > list[i + 1]) {
      pos = i + 1;
      break;
    }
  }
  //找到pos左边第一个比他大的值
  let pos2 = getFisrtBigPos(list, pos);
  console.log(pos, pos2);
  swipArrPosition(list, pos, pos2);
  let _list = list.splice(0, pos).sort((a, b) => b - a);
  let _n = [..._list, ...list].reverse().join("");
  return pos === -1 || _n > 2 ** 31 - 1 ? -1 : _n;
};
console.log(nextGreaterElement(12443322));
//22334421
