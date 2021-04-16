//[1,[2,3],[3,4,5],[4,5]] => [1,2,3,4,5] 扁平化 去重
let a = [1, [2, 3], [3, 4, 5], [4, 5]];
//先扁平化
let b = [].concat(...a);
let c = Reflect.apply(Array.prototype.concat, [], a);
let d = a.reduce((arr, item) => arr.concat(item), []);

//去重
let e = [...new Set(b)];
let f = Array.from(new Set(b));

//多层数组(>2)
var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];
//方法一 es6 flat
arr.flat(Infinity); //[1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14, 10]

//方法二 迭代
function flat(arr) {
  let _arr = arr.reduce((arr, item) => {
    return arr.concat(item instanceof Array ? flat(item) : item);
  }, []);
  return _arr;
}
console.log(flat(arr)); //[1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14, 10]

//方法三 序列化后正则替换
let new_arr = JSON.parse(`[${JSON.stringify(arr).replace(/\[|\]/g, "")}]`);
console.log(new_arr); //[ 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14, 10 ]
