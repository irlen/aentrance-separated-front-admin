"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * 判断是否为字符串
 * @param {String} 判断对象
 * @return {Boolean}
 */
var isString = exports.isString = function isString(str) {
  return Object.prototype.toString.call(str) === "[object String]";
};