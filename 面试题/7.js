/**
 *  实现一个字符串反转：输入：www.toutiao.com.cn 输出：cn.com.toutiao.www
 *  要求：1.不使用字符串处理函数 2.空间复杂度尽可能小
 */

function stringReverse(str) {
  return str.split(".").reverse().join(".");
}

console.log(stringReverse("www.toutiao.com.cn"));