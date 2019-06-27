'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var merge = function merge(tar, source) {
    var merge = function merge(origin, modifys) {
        for (var k in modifys) {
            if (Object.prototype.toString.call(modifys[k]) == '[object Object]') {
                if (_typeof(origin[k]) !== 'object') {
                    origin[k] = {};
                }
                merge(origin[k], modifys[k]);
            } else {
                origin[k] = modifys[k];
            }
        }
    };
    var cp = JSON.parse(JSON.stringify(tar));
    merge(cp, source);
    return cp;
};
exports.default = merge;