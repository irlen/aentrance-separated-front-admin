'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isObj(obj) {
    return ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && obj !== null;
}

// 深度克隆
function deepClone(obj) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new WeakMap();

    var cloneObj = void 0;
    var Constructor = obj.constructor;
    switch (Constructor) {
        case RegExp:
            cloneObj = new Constructor(obj);
            break;
        case Date:
            cloneObj = new Constructor(obj.getTime());
            break;
        default:
            if (hash.has(obj)) return hash.get(obj);
            cloneObj = new Constructor();
            hash.set(obj, cloneObj);
    }
    for (var key in obj) {
        cloneObj[key] = isObj(obj[key]) ? deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj;
}

// const deepClone = (obj) => {
//     var proto = Object.getPrototypeOf(obj);
//     return Object.assign({}, Object.create(proto), obj);

// }
exports.default = deepClone;